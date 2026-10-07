import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import { SalesSummaryWidget } from '../components/SalesSummaryWidget';
import { QuickActions } from '../components/QuickActions';
export function DashboardPage() {
  const { profile, hasRole } = useAuth();
  return <main className="space-y-6 text-[#800000]">
    <h1 className="text-2xl font-bold">Welcome, {profile?.displayName || 'team member'}</h1>
    <p>Talk of the Town · Restaurant workspace</p>
    <QuickActions />
    {(hasRole('OWNER') || hasRole('ADMIN') || hasRole('MANAGER') || hasRole('ACCOUNTANT')) && <SalesSummaryWidget />}
    <section className="rounded-xl border border-[#ebd5da] bg-white p-5 space-y-3">
      <h2 className="font-bold">Prepare for your first service</h2>
      <p>Confirm menu prices and tax settings, assign staff access, and test a full order from the counter to the kitchen.</p>
      <div className="flex gap-4"><Link className="underline" to="/pos">Open counter</Link><Link className="underline" to="/kds">Open kitchen</Link></div>
      <p className="text-sm">Online payments and offline order syncing are not connected yet. Other modules are still being prepared for live use.</p>
    </section>
  </main>;
}
