'use client';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Nav, SiteFooter } from '../src/components';

export default function AppShell({ children, auth = null }) {
  const pathname = usePathname() || '/';

  // Admin & login routes provide their own chrome — don't double-wrap.
  const isStandalone =
    pathname.startsWith('/admin') ||
    pathname === '/login';

  // Transparent nav on the home hero and the new slug-based project detail
  // pages (/projects/[categorySlug]/[projectSlug]).
  const transparent =
    pathname === '/' || /^\/projects\/[^/]+\/[^/]+$/.test(pathname);

  // slide hover style for client cards; navy accent block on hover
  useEffect(() => {
    document.body.setAttribute('data-hover-style', 'slide');
    document.body.style.setProperty('--accent', 'var(--dark)');
  }, []);

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <>
      <Nav transparent={transparent} auth={auth} />
      {children}
      <SiteFooter />
    </>
  );
}
