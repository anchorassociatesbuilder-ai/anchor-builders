import { createClient } from '../utils/supabase/server';
import { canonicalClientKey } from '../utils/clients';
import { SITE_DATA } from '../src/data';
import { toSlug } from '../utils/slug';

const STORAGE_BUCKET = 'project-images';

// is_cover flag → cover_image_url → first image → null.
export function pickCoverUrl(images = [], coverImageUrl = null) {
  const flagged = images.find((img) => img.is_cover && img.public_url);
  if (flagged) return flagged.public_url;
  if (coverImageUrl) return coverImageUrl;
  const firstWithUrl = images.find((img) => img.public_url);
  return firstWithUrl?.public_url || null;
}

export async function getActiveCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('project_categories')
    .select('id, name, slug, description, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });
  if (error) {
    console.error('getActiveCategories', error.message);
    return [];
  }
  return data || [];
}

// Active projects with category, sorted by sort_order.
export async function getActiveProjects() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      slug,
      description,
      location,
      year_completed,
      cover_image_url,
      is_featured,
      sort_order,
      category:project_categories!inner ( id, name, slug, sort_order, is_active )
    `)
    .eq('is_active', true)
    .eq('category.is_active', true)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('getActiveProjects', error.message);
    return [];
  }
  return data || [];
}

export async function getFeaturedProjects(limit = 6) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      slug,
      location,
      year_completed,
      cover_image_url,
      sort_order,
      category:project_categories!inner ( name, slug, is_active )
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .eq('category.is_active', true)
    .order('sort_order', { ascending: true })
    .limit(limit);
  if (error) {
    console.error('getFeaturedProjects', error.message);
    return [];
  }
  return data || [];
}

// Category + projects by name (case-insensitive). Used by /services/[id].
export async function getProjectsByCategoryName(name) {
  if (!name) return { category: null, projects: [] };
  const supabase = createClient();
  const { data: cats } = await supabase
    .from('project_categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .ilike('name', name)
    .limit(1);
  const category = cats?.[0] || null;
  if (!category) return { category: null, projects: [] };

  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, slug, location, year_completed, cover_image_url, sort_order')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  return { category, projects: projects || [] };
}

export async function getCategoryWithProjects(categorySlug) {
  const supabase = createClient();
  const { data: category, error: catErr } = await supabase
    .from('project_categories')
    .select('id, name, slug, description, sort_order')
    .eq('slug', categorySlug)
    .eq('is_active', true)
    .maybeSingle();
  if (catErr || !category) return null;

  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, slug, location, year_completed, cover_image_url, description, sort_order')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  return { category, projects: projects || [] };
}

// Project detail with category, gallery images, and related projects.
export async function getProjectDetail(categorySlug, projectSlug) {
  const supabase = createClient();
  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      id, title, slug, description, location, year_completed, client,
      cover_image_url, is_featured,
      category:project_categories!inner ( id, name, slug, is_active )
    `)
    .eq('slug', projectSlug)
    .eq('category.slug', categorySlug)
    .eq('is_active', true)
    .eq('category.is_active', true)
    .maybeSingle();
  if (error || !project) return null;

  const { data: images } = await supabase
    .from('project_images')
    .select('id, storage_path, public_url, alt_text, caption, is_cover, sort_order')
    .eq('project_id', project.id)
    .order('sort_order', { ascending: true });

  const { data: related } = await supabase
    .from('projects')
    .select('id, title, slug, location, year_completed, cover_image_url, sort_order')
    .eq('category_id', project.category.id)
    .eq('is_active', true)
    .neq('id', project.id)
    .order('sort_order', { ascending: true })
    .limit(12);

  return { project, images: images || [], related: related || [] };
}

// Projects for a client matched by canonical key (tolerates name variants).
export async function getProjectsForClient(clientName) {
  const key = canonicalClientKey(clientName);
  if (!key) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id, title, slug, location, year_completed, cover_image_url, client, sort_order,
      category:project_categories!inner ( name, slug, is_active )
    `)
    .eq('is_active', true)
    .eq('category.is_active', true)
    .order('sort_order', { ascending: true });
  if (error || !Array.isArray(data)) {
    if (error) console.error('getProjectsForClient', error.message);
    return [];
  }
  return data.filter((p) => canonicalClientKey(p.client) === key);
}

// Admin project form dropdown: the same clients the public roster lists.
export async function getClientOptions() {
  const roster = await getClientRoster();
  return roster.map((c) => ({ name: c.name, fullName: c.fullName }));
}

// Curated list from src/data.js. Only used when the clients table can't be read.
function curatedRoster() {
  return SITE_DATA.CLIENTS.map((c) => {
    const t = SITE_DATA.TESTIMONIALS.find((x) => x.clientId === c.id);
    return {
      key: canonicalClientKey(c.name),
      slug: c.id,
      name: c.name,
      fullName: c.fullName || c.name,
      sector: c.sector || 'Private',
      since: c.since ?? null,
      total: c.projects ?? null,
      testimonialQuote: t?.quote || null,
      testimonialWho: t?.who || null,
      logoUrl: null,
    };
  });
}

// Public client roster. The admin clients table decides who is listed and what
// each client shows, so deleting a row there removes the client from the site.
// Clients that are also in src/data.js keep that order; the rest follow by name.
export async function getClientRoster() {
  let rows = null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('clients')
      .select('name, slug, full_name, sector, since, total_projects, testimonial_quote, testimonial_who, logo_url')
      .order('name', { ascending: true });
    if (error) console.error('getClientRoster', error.message);
    else if (Array.isArray(data)) rows = data;
  } catch {
    // Table unreachable: fall back to the curated list below.
  }
  if (!rows) return curatedRoster();

  const curated = new Map(
    SITE_DATA.CLIENTS.map((c, i) => [canonicalClientKey(c.name), { id: c.id, index: i }])
  );
  const byKey = new Map();
  for (const r of rows) {
    const key = canonicalClientKey(r.name);
    if (!key || byKey.has(key)) continue; // one entry per client, even if spelled twice
    byKey.set(key, {
      key,
      slug: r.slug || curated.get(key)?.id || toSlug(r.name),
      name: r.name,
      fullName: r.full_name || r.name,
      sector: r.sector || 'Private',
      since: r.since ?? null,
      total: r.total_projects ?? null,
      testimonialQuote: r.testimonial_quote || null,
      testimonialWho: r.testimonial_who || null,
      logoUrl: r.logo_url || null,
    });
  }

  // Rows arrive sorted by name and sort() is stable, so non-curated clients
  // (all ranked last) stay alphabetical.
  const rank = (c) => curated.get(c.key)?.index ?? SITE_DATA.CLIENTS.length;
  return [...byKey.values()].sort((a, b) => rank(a) - rank(b));
}

// Admin: all client rows from DB.
export async function getAllClients() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, slug, full_name, sector, since, total_projects, testimonial_quote, testimonial_who, logo_url, logo_storage_path')
      .order('name', { ascending: true });
    if (error || !Array.isArray(data)) return [];
    return data;
  } catch {
    return [];
  }
}

// Service cover images keyed by service id (src/data.js SERVICES). Returns a
// plain map { serviceId: image_url }. Resilient if the table doesn't exist yet.
export async function getServiceCovers() {
  try {
    const supabase = createClient();
    const { data } = await supabase.from('service_covers').select('service_id, image_url');
    const map = {};
    if (Array.isArray(data)) {
      for (const r of data) if (r.service_id && r.image_url) map[r.service_id] = r.image_url;
    }
    return map;
  } catch {
    return {};
  }
}

// Active homepage hero slides, ordered. Public — used to build hero frames.
export async function getActiveHeroSlides() {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('hero_slides')
      .select('id, image_url, caption, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// All hero slides for the admin panel (active and hidden).
export async function getAllHeroSlides() {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('hero_slides')
      .select('id, image_url, image_storage_path, caption, sort_order, is_active')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// All project images grouped by project (for the hero image picker). Each group
// keeps its project title as a divider. Projects without images are omitted.
export async function getProjectImagesGrouped() {
  try {
    const supabase = createClient();
    const { data: projects } = await supabase
      .from('projects')
      .select('id, title, slug, sort_order')
      .order('sort_order', { ascending: true })
      .order('title', { ascending: true });
    if (!Array.isArray(projects) || projects.length === 0) return [];

    const { data: images } = await supabase
      .from('project_images')
      .select('id, project_id, public_url, sort_order')
      .order('sort_order', { ascending: true });

    const byProject = new Map();
    for (const p of projects) {
      byProject.set(p.id, { project_id: p.id, title: p.title, slug: p.slug, images: [] });
    }
    if (Array.isArray(images)) {
      for (const img of images) {
        if (!img.public_url) continue;
        const grp = byProject.get(img.project_id);
        if (grp) grp.images.push({ id: img.id, url: img.public_url });
      }
    }
    return [...byProject.values()].filter((g) => g.images.length > 0);
  } catch {
    return [];
  }
}

export function getPublicUrl(supabase, storagePath) {
  if (!storagePath) return null;
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath).data?.publicUrl || null;
}

export { STORAGE_BUCKET };
