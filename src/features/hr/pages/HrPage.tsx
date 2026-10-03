import React, { useState, useEffect } from 'react';
import { useHrStore } from '../store/hrStore';
import { HrDashboard } from '../components/HrDashboard';
import { EmployeeList } from '../components/EmployeeList';
import { AttendanceList } from '../components/AttendanceList';
import { PayrollList } from '../components/PayrollList';
import { LayoutDashboard, Users, Clock, Wallet } from 'lucide-react';

export function HrPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'attendance' | 'payroll'>('dashboard');
  const { loadAll, loading } = useHrStore();

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'payroll', label: 'Payroll', icon: Wallet },
  ] as const;

  return (
    <div className="space-y-6 text-[#800000]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#800000]">HR & Payroll</h1>
          <p className="text-xs text-[#800000]/70 font-semibold mt-0.5">Manage employees, attendance logs, leave balances, and salary vouchers</p>
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
          {activeTab === 'dashboard' && <HrDashboard />}
          {activeTab === 'employees' && <EmployeeList />}
          {activeTab === 'attendance' && <AttendanceList />}
          {activeTab === 'payroll' && <PayrollList />}
        </div>
      )}
    </div>
  );
}
