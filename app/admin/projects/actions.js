'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient, createServiceClient } from '../../../utils/supabase/server';
import { toSlug } from '../../../utils/slug';
import { STORAGE_BUCKET, getProjectsForClient } from '../../../lib/queries';
import { canonicalClientKey } from '../../../utils/clients';

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

function bust(projectId) {
  revalidatePath('/admin/projects');
  revalidatePath('/admin/categories');
  if (projectId) revalidatePath(`/admin/projects/${projectId}/images`);
  revalidatePath('/projects');
  revalidatePath('/clients', 'layout');
  revalidatePath('/', 'layout');
}

/**
 * Keep clients.total_projects consistent after a project is saved. Best-effort
 * and never blocks the save (the `clients` table is optional).
 *
 *  - Matches the client row by CANONICAL key, so a typed "Allied Bank Limited"
 *    updates the existing "Allied Bank" row instead of duplicating it.
 *  - `increment` (admin marked it a new/additional project, or first-time
 *    client assignment) bumps the total by 1.
 *  - Always enforces total_projects >= the client's displayable project count.
 *  - A brand-new/custom client with no row yet is created with total 1 (the
 *    first project), never below the uploaded count. Only when `allowCreate`
 *    is set (the client was just picked), so re-saving a project whose client
 *    was deleted from the roster doesn't bring that client back.
 *  - Never decrements; an old client losing a project keeps its total.
 */
async function reconcileClientTotal(supabase, clientName, increment, allowCreate = true) {
  const name = String(clientName || '').trim();
  if (!name) return;
  const key = canonicalClientKey(name);
  try {
    const uploaded = (await getProjectsForClient(name)).length;
    const { data: rows } = await supabase
      .from('clients')
      .select('id, name, slug, total_projects');
    const existing = (rows || []).find((r) => canonicalClientKey(r.name) === key);

    if (!existing) {
      if (!allowCreate) return;
      // Unique slug: a short custom name like "Kingdom" would otherwise clash
      // with an existing client's slug and the insert would silently fail.
      const slug = await uniqueSlug(supabase, 'clients', name);
      const { error } = await supabase
        .from('clients')
        .upsert(
          { name, slug, total_projects: Math.max(1, uploaded) },
          { onConflict: 'name' }
        );
      if (error) console.error('reconcileClientTotal (create):', error.message);
      return;
    }

    let next = existing.total_projects ?? 0;
    if (increment) next += 1;
    if (next < uploaded) next = uploaded; // total must never be below uploaded
    const patch = {};
    if (next !== (existing.total_projects ?? 0)) patch.total_projects = next;
    if (!existing.slug) {
      const slug = await uniqueSlug(supabase, 'clients', name, existing.id);
      if (slug) patch.slug = slug;
    }
    if (Object.keys(patch).length > 0) {
      await supabase.from('clients').update(patch).eq('id', existing.id);
    }
  } catch {
    // `clients` table is optional — ignore.
  }
}

/**
 * Generate a slug from `base` that is unique within `table`.
 * Appends -2, -3, … on collision. `excludeId` skips the row being edited.
 */
async function uniqueSlug(supabase, table, base, excludeId = null) {
  const root = toSlug(base);
  if (!root) return null;
  // Each iteration is a single indexed lookup; bound it generously.
  for (let n = 1; n <= 200; n += 1) {
    const candidate = n === 1 ? root : `${root}-${n}`;
    let q = supabase.from(table).select('id').eq('slug', candidate);
    if (excludeId) q = q.neq('id', excludeId);
    const { data } = await q.maybeSingle();
    if (!data) return candidate;
  }
  // Extremely unlikely fallback — keep it unique with a timestamp suffix.
  return `${root}-${Date.now()}`;
}

/**
 * Resolve a typed category name to a category id.
 * - Case-insensitive match against existing categories → reuse it.
 * - No match → create a new category (unique slug) and return its id.
 * Returns { id } or { error }.
 */
async function resolveCategoryId(supabase, typedName) {
  const name = String(typedName || '').trim();
  if (!name) return { error: 'Category is required.' };

  const { data: existing, error: listErr } = await supabase
    .from('project_categories')
    .select('id, name, sort_order');
  if (listErr) {
    console.error('resolveCategoryId (list):', listErr.message);
    return { error: 'Could not load categories. Please try again.' };
  }

  const wanted = name.toLowerCase();
  // Temp variable holds any case-insensitive match before we decide to create.
  const match = (existing || []).find(
    (c) => String(c.name || '').trim().toLowerCase() === wanted
  );
  if (match) return { id: match.id };

  const slug = await uniqueSlug(supabase, 'project_categories', name);
  const nextOrder = (existing || []).reduce((m, c) => Math.max(m, c.sort_order ?? 0), 0) + 1;
  const { data: created, error: createErr } = await supabase
    .from('project_categories')
    .insert({ name, slug, sort_order: nextOrder, is_active: true })
    .select('id')
    .single();
  if (createErr) {
    console.error('resolveCategoryId (create):', createErr.message);
    return { error: 'Could not create category. Please try again.' };
  }
  return { id: created.id, created: true };
}

function readForm(form) {
  return {
    title: String(form.get('title') || '').trim(),
    client: String(form.get('client') || '').trim() || null,
    category_name: String(form.get('category_name') || '').trim(),
    description: String(form.get('description') || '').trim() || null,
    location: String(form.get('location') || '').trim() || null,
    year_completed: form.get('year_completed') ? Number(form.get('year_completed')) : null,
    is_featured: form.get('is_featured') === 'on' || form.get('is_featured') === 'true',
    is_active: form.get('is_active') === 'on' || form.get('is_active') === 'true',
    sort_order: Number(form.get('sort_order') || 0) || 0,
  };
}

export async function createProject(form) {
  const supabase = await requireAdmin();
  const v = readForm(form);
  if (!v.title) return { error: 'Title is required.' };
  if (!v.category_name) return { error: 'Category is required.' };

  const cat = await resolveCategoryId(supabase, v.category_name);
  if (cat.error) return { error: cat.error };

  // Slug is auto-generated from the title and made unique.
  const slug = await uniqueSlug(supabase, 'projects', v.title);
  if (!slug) return { error: 'Could not generate a slug from the title.' };

  const { category_name, ...rest } = v;
  const { data, error } = await supabase
    .from('projects')
    .insert({ ...rest, category_id: cat.id, slug })
    .select('id')
    .single();
  if (error) {
    console.error('createProject:', error.message);
    return { error: 'Could not save project. Please try again.' };
  }

  const isNewForClient =
    form.get('is_new_for_client') === 'on' || form.get('is_new_for_client') === 'true';
  await reconcileClientTotal(supabase, v.client, isNewForClient);
  bust(data?.id);
  return { ok: true, id: data?.id };
}

export async function updateProject(form) {
  const supabase = await requireAdmin();
  const id = String(form.get('id') || '');
  if (!id) return { error: 'Missing project id.' };
  const v = readForm(form);
  if (!v.title) return { error: 'Title is required.' };
  if (!v.category_name) return { error: 'Category is required.' };

  const cat = await resolveCategoryId(supabase, v.category_name);
  if (cat.error) return { error: cat.error };

  // Capture the previous client so we can detect a first-time assignment (which
  // should bump the count) vs. an ordinary edit (which should not).
  const { data: before } = await supabase
    .from('projects')
    .select('client')
    .eq('id', id)
    .maybeSingle();
  const oldClient = before?.client || '';

  // Slug is intentionally left unchanged on edit to keep existing URLs and
  // bookmarks stable.
  const { category_name, ...rest } = v;
  const { error } = await supabase
    .from('projects')
    .update({ ...rest, category_id: cat.id, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    console.error('updateProject:', error.message);
    return { error: 'Could not save project. Please try again.' };
  }

  // Only bump the count when the admin marks it new, or when a project gets a
  // client for the first time. A plain edit never increments; reconcile still
  // enforces total >= uploaded for the (possibly new) client. Old client totals
  // are intentionally left untouched (never auto-decremented).
  const isNewForClient =
    form.get('is_new_for_client') === 'on' || form.get('is_new_for_client') === 'true';
  const firstAssignment = !String(oldClient).trim() && !!String(v.client).trim();
  const clientChanged = canonicalClientKey(oldClient) !== canonicalClientKey(v.client);
  await reconcileClientTotal(supabase, v.client, isNewForClient || firstAssignment, clientChanged);
  bust(id);
  return { ok: true };
}

/**
 * Delete a project. Fetch all storage paths first, batch-delete files,
 * then delete the project row (DB cascade removes project_images rows).
 */
export async function deleteProject(form) {
  const supabase = await requireAdmin();
  const id = String(form.get('id') || '');
  if (!id) return { error: 'Missing project id.' };

  const { data: images } = await supabase
    .from('project_images')
    .select('storage_path')
    .eq('project_id', id);

  const paths = (images || []).map((i) => i.storage_path).filter(Boolean);
  if (paths.length > 0) {
    const service = createServiceClient();
    const { error: rmErr } = await service.storage.from(STORAGE_BUCKET).remove(paths);
    if (rmErr) {
      console.error('deleteProject (storage):', rmErr.message);
      return { error: 'Could not delete project. Please try again.' };
    }
  }

  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) {
    console.error('deleteProject:', error.message);
    return { error: 'Could not delete project. Please try again.' };
  }

  bust(id);
  return { ok: true };
}
