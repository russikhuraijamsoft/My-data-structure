import React, { useState, useEffect } from 'react';
import { useReportsStore } from '../store/reportsStore';
import { ReportsDashboard } from '../components/ReportsDashboard';
import { LayoutDashboard, FileBarChart, PieChart, ShoppingBag, Users, Wallet } from 'lucide-react';

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sales' | 'inventory' | 'kitchen' | 'crm' | 'finance'>('dashboard');
  const { loadReports, loading } = useReportsStore();

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const tabs = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales & POS', icon: FileBarChart },
    { id: 'inventory', label: 'Inventory', icon: ShoppingBag },
    { id: 'kitchen', label: 'Kitchen & KDS', icon: PieChart },
    { id: 'crm', label: 'Customer Insights', icon: Users },
    { id: 'finance', label: 'Financial Audit', icon: Wallet },
  ] as const;

  return (
    <div className="space-y-6 text-[#800000]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#800000]">Reports & Analytics</h1>
          <p className="text-xs text-[#800000]/70 font-semibold mt-0.5">Comprehensive operational intelligence and audit ledgers</p>
        </div>
      </div>

      <div className="border-b border-[#ebd5da]">
        <nav className="-mb-px flex space-x-6 overflow-x-auto no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 py-3 px-1 border-b-2 font-bold text-xs whitespace-nowrap transition-colors cursor-pointer
                  ${isActive 
                    ? 'border-[#800000] text-[#800000]' 
                    : 'border-transparent text-[#800000]/70 hover:text-[#800000]'}
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {loading && activeTab === 'dashboard' ? (
        <div className="flex items-center justify-center h-64 text-[#800000]">
          <div className="w-8 h-8 border-4 border-[#800000] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="py-2">
          {activeTab === 'dashboard' && <ReportsDashboard />}
          {activeTab !== 'dashboard' && (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-[#ebd5da] rounded-2xl bg-[#fdf5f6]/50">
              <FileBarChart className="w-12 h-12 text-[#dcabb5] mb-3" />
              <h3 className="text-base font-bold text-[#800000] mb-1">
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
              <p className="text-xs text-[#800000]/70 max-w-md">
                Detailed reporting and drill-down metrics for this operational sector.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
