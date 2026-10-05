// App Router metadata route → served at /robots.txt.
// Allows normal crawling of all public content; keeps auth/admin utility
// routes out of the index. Sitemap is advertised below.
import { SITE_URL as BASE_URL } from '../lib/site';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/login', '/auth'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
