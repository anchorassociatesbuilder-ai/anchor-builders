// App Router metadata route → served at /sitemap.xml.
// Lists every public, indexable URL: static marketing pages, service pages,
// client pages, and the database-driven project category + detail pages.
import { SITE_DATA } from '../src/data';
import { getActiveCategories, getActiveProjects, getClientRoster } from '../lib/queries';
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

  // Client, project category and project detail pages come from Supabase.
  // Wrapped so a DB hiccup never breaks sitemap generation; the static routes
  // above always emit.
  let clientRoutes = [];
  let categoryRoutes = [];
  let projectRoutes = [];
  try {
    const [clients, categories, projects] = await Promise.all([
      getClientRoster(),
      getActiveCategories(),
      getActiveProjects(),
    ]);
    // Same list as the /clients page, so deleted clients drop out here too.
    clientRoutes = clients
      .filter((c) => c.slug)
      .map((c) => ({
        url: `${BASE_URL}/clients/${c.slug}`,
        lastModified: now,
        changeFrequency: 'yearly',
        priority: 0.4,
      }));
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
    // Leave client and project routes empty; the rest of the sitemap still serves.
  }

  return [...staticRoutes, ...serviceRoutes, ...clientRoutes, ...categoryRoutes, ...projectRoutes];
}
