const isDev = process.env.NODE_ENV !== 'production';

// Supabase host (auth, REST, realtime, storage) — needed in connect-src/img-src
// so the browser Supabase client and admin storage thumbnails keep working.
const SUPABASE_HOST = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host;
  } catch {
    return 'bqhqlzmcshiuvlbcjkud.supabase.co';
  }
})();

// Content-Security-Policy. 'unsafe-inline' is required for scripts because Next
// injects inline hydration/bootstrap scripts and we don't run a nonce setup;
// 'unsafe-inline' is also required for styles (inline style attrs + next/font).
// We deliberately omit 'unsafe-eval' (Next 14 production doesn't need it) so the
// policy still meaningfully restricts injected external scripts, framing,
// <base>, <object>/<embed>, form exfiltration, and non-Supabase connections.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://${SUPABASE_HOST}`,
  "font-src 'self' data:",
  `connect-src 'self' https://${SUPABASE_HOST} wss://${SUPABASE_HOST}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Security headers applied to every route. The CSP + HSTS are emitted only in
  // production so they don't interfere with `next dev` (HMR uses eval + ws).
  async headers() {
    const headers = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
      },
    ];
    if (!isDev) {
      headers.push({ key: 'Content-Security-Policy', value: contentSecurityPolicy });
      headers.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains',
      });
    }
    return [{ source: '/:path*', headers }];
  },
  images: {
    // Vercel's free plan allows 5,000 image transformations a month, and each
    // width and format of each photo counts as one. So: AVIF only (smallest
    // files, supported by all current browsers), three screen widths plus two
    // thumbnail widths instead of Next's sixteen, and resized copies cached for
    // a year (uploads get unique file names, so a cached copy never goes stale).
    formats: ['image/avif'],
    deviceSizes: [640, 1200, 1920],
    imageSizes: [256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bqhqlzmcshiuvlbcjkud.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};
export default nextConfig;
