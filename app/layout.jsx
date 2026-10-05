import React, { Suspense } from 'react';
import { Cormorant_Garamond, Manrope, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import AppShell from './AppShell';
import SessionGuard from './SessionGuard';
import NavProgress from './NavProgress';
import ImageFallback from './ImageFallback';
import { createClient } from '../utils/supabase/server';
import { SITE_URL, SITE_NAME, BRAND_NAVY } from '../lib/site';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
});
const sans = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

// Icons and the link preview image come from files in this folder (favicon.ico,
// icon.svg, apple-icon.png, opengraph-image.png). openGraph has no title of its
// own on purpose: each page's title is used for its link preview.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Anchor Associates & Builders — Construction & Contracting · Pakistan',
  description:
    'Anchor Associates & Builders — C-2 PEC registered construction firm based in Islamabad. Civil & MEP, prefabricated, agricultural, tensile, renovation and specialty construction across Pakistan.',
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
  },
};

// Tints the mobile browser bar in the logo navy.
export const viewport = {
  themeColor: BRAND_NAVY,
};

async function getAuth() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  return { email: user.email || '', role: profile?.role || 'customer' };
}

export default async function RootLayout({ children }) {
  const auth = await getAuth();

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <SessionGuard />
        <ImageFallback />
        {/* NavProgress reads useSearchParams, which needs a Suspense boundary. */}
        <Suspense fallback={null}>
          <NavProgress />
        </Suspense>
        <AppShell auth={auth}>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
