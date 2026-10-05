// App Router metadata route → served at /sitemap.xml.
// Lists every public, indexable URL: static marketing pages, service pages,
// client pages, and the database-driven project category + detail pages.
import { SITE_DATA } from '../src/data';
import { getActiveCategories, getActiveProjects } from '../lib/queries';
import { SITE_URL as BASE_URL } from '../lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const now = new Date();

  const staticRoutes = ['', '/about', '/services', '/projects', '/clients', '/contact'].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));

  const serviceRoutes = SITE_DATA.SERVICES.map((s) => ({
    url: `${BASE_URL}/services/${s.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Hardcoded clients all have detail pages (/clients/[id]); dynamic ones don't.
  const clientRoutes = SITE_DATA.CLIENTS.map((c) => ({
    url: `${BASE_URL}/clients/${c.id}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.4,
  }));

  // Project category + detail pages come from Supabase. Wrapped so a DB hiccup
  // never breaks sitemap generation — the static routes above always emit.
  let categoryRoutes = [];
  let projectRoutes = [];
  try {
    const [categories, projects] = await Promise.all([
      getActiveCategories(),
      getActiveProjects(),
    ]);
    categoryRoutes = categories
      .filter((c) => c.slug)
      .map((c) => ({
        url: `${BASE_URL}/projects/${c.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
    projectRoutes = projects
      .filter((p) => p.category?.slug && p.slug)
      .map((p) => ({
        url: `${BASE_URL}/projects/${p.category.slug}/${p.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      }));
  } catch {
    // Leave project routes empty; the rest of the sitemap still serves.
  }

  return [...staticRoutes, ...serviceRoutes, ...clientRoutes, ...categoryRoutes, ...projectRoutes];
}
