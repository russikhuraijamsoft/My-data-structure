import React, { useEffect } from 'react';
import { useReportsStore } from '../../reports/store/reportsStore';
import { ReportsDashboard } from '../../reports/components/ReportsDashboard';
export function SalesSummaryWidget() {
  const { loadReports, loading, error } = useReportsStore();
  useEffect(() => { void loadReports(); }, [loadReports]);
  return <section className="space-y-3">
    <div className="flex justify-between"><h2 className="font-bold">Sales overview</h2><button disabled={loading} onClick={() => void loadReports()} className="underline">Refresh</button></div>
    {loading ? <p>Loading saved orders…</p> : error ? <p role="alert">Sales unavailable: {error}</p> : <ReportsDashboard />}
  </section>;
}
