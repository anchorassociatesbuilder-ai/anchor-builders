// Public site URL, used wherever an absolute link is needed (sitemap, robots,
// social share images, structured data). The live site is the www domain (the
// bare domain redirects to it); NEXT_PUBLIC_SITE_URL in Vercel overrides this.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.anchorassociatesandbuilders.com';

export const SITE_NAME = 'Anchor Associates & Builders';

// Mystic Navy, the site's main colour (favicon tile, share image, browser bar).
// Keep in step with --dark in src/styles.css.
export const BRAND_NAVY = '#13273f';
