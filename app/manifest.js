// App Router metadata route → served at /manifest.webmanifest.
// Gives Android / Chrome the logo icon and navy colour when someone adds the
// site to their home screen. display: 'browser' keeps it a normal website
// (no install prompt, opens in a regular tab).
import { SITE_NAME, BRAND_NAVY } from '../lib/site';

export default function manifest() {
  return {
    name: SITE_NAME,
    short_name: 'Anchor',
    description: 'C-2 PEC registered construction and contracting firm based in Islamabad.',
    start_url: '/',
    display: 'browser',
    background_color: BRAND_NAVY,
    theme_color: BRAND_NAVY,
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
