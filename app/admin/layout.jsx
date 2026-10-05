import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../utils/supabase/server';
import AdminNav from './AdminNav';
import { LogoLockup } from '../../src/Logo';
import './admin.css';

export const metadata = { title: 'Admin — Anchor' };

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
  return { user, profile };
}

export default async function AdminLayout({ children }) {
  const { user } = await requireAdmin();
  const label = user.email || 'admin';

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Link className="admin-brand" href="/admin">
          <LogoLockup />
          <span className="name">Admin</span>
        </Link>
        <AdminNav />
        <div className="admin-user">
          <div className="lbl">Signed in as</div>
          <div className="who">{label}</div>
          <form action="/auth/signout" method="post">
            <button type="submit" className="admin-signout">Sign out</button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
