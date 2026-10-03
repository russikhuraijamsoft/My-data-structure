import React from 'react';
import { useFinanceStore } from '../store/financeStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { TrendingUp, TrendingDown, Landmark, Wallet } from 'lucide-react';

export function FinanceDashboard() {
  const { accounts, transactions } = useFinanceStore();

  const totalAssets = accounts.filter(a => a.type === 'ASSET').reduce((sum, a) => sum + a.balance, 0);
  const totalRevenue = accounts.filter(a => a.type === 'INCOME').reduce((sum, a) => sum + a.balance, 0);
  const totalExpenses = accounts.filter(a => a.type === 'EXPENSE').reduce((sum, a) => sum + a.balance, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6 text-[#800000]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Gross Revenue" 
          value={`₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          icon={<TrendingUp className="w-5 h-5 text-[#800000]" />}
        />
        <StatCard 
          title="Operating Expenses" 
          value={`₹${totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          icon={<TrendingDown className="w-5 h-5 text-[#800000]" />}
        />
        <StatCard 
          title="Net Profit" 
          value={`₹${netProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          icon={<Wallet className="w-5 h-5 text-[#800000]" />}
        />
        <StatCard 
          title="Liquid Cash & Bank" 
          value={`₹${totalAssets.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          icon={<Landmark className="w-5 h-5 text-[#800000]" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[#800000]">Recent Journal Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map(txn => (
                <div key={txn.id} className="flex justify-between items-center p-3 bg-[#fdf5f6] rounded-xl border border-[#ebd5da]">
                  <div>
                    <p className="font-bold text-sm text-[#800000]">{txn.reference}</p>
                    <p className="text-xs text-[#800000]/70 font-medium">{txn.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-[#800000]">₹{txn.totalDebit.toFixed(2)}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#800000] border border-[#ebd5da]">
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[#800000]">Cost of Goods & Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accounts.filter(a => a.type === 'EXPENSE').sort((a, b) => b.balance - a.balance).slice(0, 5).map(acc => (
                <div key={acc.id} className="flex justify-between items-center p-3 bg-[#fdf5f6] rounded-xl border border-[#ebd5da]">
                  <div>
                    <p className="font-bold text-sm text-[#800000]">{acc.name}</p>
                    <p className="text-xs text-[#800000]/70">{acc.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-[#800000]">₹{acc.balance.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#800000]/70">{title}</p>
          <div className="p-2 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl">
            {icon}
          </div>
        </div>
        <h3 className="text-2xl font-black text-[#800000] truncate">{value}</h3>
      </CardContent>
    </Card>
  );
}
