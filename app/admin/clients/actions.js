'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient, createServiceClient } from '../../../utils/supabase/server';
import { toSlug } from '../../../utils/slug';
import { STORAGE_BUCKET } from '../../../lib/queries';

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') redirect('/');
  return supabase;
}

function bust() {
  revalidatePath('/admin/clients');
  revalidatePath('/clients', 'layout');
  revalidatePath('/', 'layout');
}

function readForm(form) {
  return {
    name: String(form.get('name') || '').trim(),
    full_name: String(form.get('full_name') || '').trim() || null,
    sector: String(form.get('sector') || '').trim() || null,
    since: form.get('since') ? Number(form.get('since')) : null,
    testimonial_quote: String(form.get('testimonial_quote') || '').trim() || null,
    testimonial_who: String(form.get('testimonial_who') || '').trim() || null,
  };
}

export async function createClientRow(form) {
  const supabase = await requireAdmin();
  const v = readForm(form);
  if (!v.name) return { error: 'Name is required.' };
  const slug = toSlug(form.get('slug') || v.name);
  if (!slug) return { error: 'Could not generate a slug from the name.' };

  const { error } = await supabase.from('clients').insert({ ...v, slug });
  if (error) {
    console.error('createClientRow:', error.message);
    return { error: 'Could not save client. Please try again.' };
  }
  bust();
  return { ok: true };
}

export async function updateClientRow(form) {
  const supabase = await requireAdmin();
  const id = String(form.get('id') || '');
  if (!id) return { error: 'Missing client id.' };
  const v = readForm(form);
  if (!v.name) return { error: 'Name is required.' };

  const patch = { ...v };
  const slugInput = form.get('slug');
  if (slugInput) patch.slug = toSlug(slugInput);

  const { error } = await supabase.from('clients').update(patch).eq('id', id);
  if (error) {
    console.error('updateClientRow:', error.message);
    return { error: 'Could not update client. Please try again.' };
  }
  bust();
  return { ok: true };
}

export async function updateClientLogo(form) {
  const supabase = await requireAdmin();
  const id = String(form.get('id') || '');
  if (!id) return { error: 'Missing client id.' };
  const logo_url = String(form.get('logo_url') || '').trim() || null;
  const logo_storage_path = String(form.get('logo_storage_path') || '').trim() || null;
  const { error } = await supabase
    .from('clients')
    .update({ logo_url, logo_storage_path })
    .eq('id', id);
  if (error) {
    console.error('updateClientLogo:', error.message);
    return { error: 'Could not save logo. Please try again.' };
  }
  bust();
  return { ok: true };
}

export async function deleteClientLogo(form) {
  const supabase = await requireAdmin();
  const id = String(form.get('id') || '');
  if (!id) return { error: 'Missing client id.' };
  const { error } = await supabase
    .from('clients')
    .update({ logo_url: null, logo_storage_path: null })
    .eq('id', id);
  if (error) {
    console.error('deleteClientLogo:', error.message);
    return { error: 'Could not remove logo. Please try again.' };
  }
  bust();
  return { ok: true };
}

export async function deleteClientRow(form) {
  const supabase = await requireAdmin();
  const id = String(form.get('id') || '');
  if (!id) return { error: 'Missing client id.' };

  // Removes only the roster row; project rows (projects.client text) are left
  // untouched, so no project is orphaned or deleted.
  const { data: deleted, error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)
    .select('logo_storage_path');
  if (error) {
    console.error('deleteClientRow:', error.message);
    return { error: 'Could not delete client. Please try again.' };
  }

  // Best effort: drop the logo file of the row that was actually deleted so it
  // doesn't linger in storage.
  const logoPath = deleted?.[0]?.logo_storage_path;
  if (logoPath) {
    try { await createServiceClient().storage.from(STORAGE_BUCKET).remove([logoPath]); } catch {}
  }
  bust();
  return { ok: true };
}
