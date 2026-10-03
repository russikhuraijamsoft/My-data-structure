import React, { useState, useEffect } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { FinanceDashboard } from '../components/FinanceDashboard';
import { AccountsList } from '../components/AccountsList';
import { TransactionsList } from '../components/TransactionsList';
import { LayoutDashboard, BookOpen, Receipt, FileText } from 'lucide-react';

export function FinancePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'transactions' | 'reports'>('dashboard');
  const { loadAccounts, loadTransactions, loading } = useFinanceStore();

  useEffect(() => {
    loadAccounts();
    loadTransactions();
  }, [loadAccounts, loadTransactions]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'accounts', label: 'Chart of Accounts', icon: BookOpen },
    { id: 'transactions', label: 'Journal Entries', icon: Receipt },
    { id: 'reports', label: 'Financial Statements', icon: FileText },
  ] as const;

  return (
    <div className="space-y-6 text-[#800000]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#800000]">Finance & General Ledger</h1>
          <p className="text-xs text-[#800000]/70 font-semibold mt-0.5">Double-entry accounting, P&L statements, and operational expenses</p>
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
          {activeTab === 'dashboard' && <FinanceDashboard />}
          {activeTab === 'accounts' && <AccountsList />}
          {activeTab === 'transactions' && <TransactionsList />}
          {activeTab === 'reports' && (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-[#ebd5da] rounded-2xl bg-[#fdf5f6]/50">
              <FileText className="w-12 h-12 text-[#dcabb5] mb-3" />
              <h3 className="text-base font-bold text-[#800000] mb-1">Standard Financial Statements</h3>
              <p className="text-xs text-[#800000]/70 max-w-md mb-4">
                Export balance sheets, trial balances, and periodic profit & loss compliant with Indian GST reporting.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button className="px-3.5 py-1.5 bg-white border border-[#ebd5da] rounded-xl text-xs font-bold text-[#800000] hover:bg-[#fee8eb] cursor-pointer">Profit & Loss</button>
                <button className="px-3.5 py-1.5 bg-white border border-[#ebd5da] rounded-xl text-xs font-bold text-[#800000] hover:bg-[#fee8eb] cursor-pointer">Balance Sheet</button>
                <button className="px-3.5 py-1.5 bg-white border border-[#ebd5da] rounded-xl text-xs font-bold text-[#800000] hover:bg-[#fee8eb] cursor-pointer">Trial Balance</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
