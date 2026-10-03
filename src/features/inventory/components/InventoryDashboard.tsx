import React, { useMemo } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Package, AlertTriangle, TrendingDown, RefreshCw, Archive, BarChart2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#800000', '#9e1234', '#b01b3f', '#d0395c', '#e36a83'];

export function InventoryDashboard() {
  const { items, categories, batches } = useInventoryStore();

  const metrics = useMemo(() => {
    let totalItems = items.length;
    let totalValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    
    items.forEach(item => {
      totalValue += (item.currentStock * item.costPrice);
      if (item.currentStock <= 0) outOfStockCount++;
      else if (item.currentStock <= item.minimumStock) lowStockCount++;
    });

    const expiringSoon = batches.filter(b => {
      if (b.status === 'DEPLETED' || b.status === 'EXPIRED') return false;
      const expiryDate = new Date(b.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 3600 * 24));
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    }).length;

    return { totalItems, totalValue, lowStockCount, outOfStockCount, expiringSoon };
  }, [items, batches]);

  const valueByCategory = useMemo(() => {
    const data: Record<string, number> = {};
    items.forEach(item => {
      const cat = categories.find(c => c.id === item.categoryId)?.name || 'Unknown';
      data[cat] = (data[cat] || 0) + (item.currentStock * item.costPrice);
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [items, categories]);

  return (
    <div className="space-y-6 text-[#800000]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Inventory Value" 
          value={`₹${metrics.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          icon={<IndianRupeeIcon className="w-5 h-5 text-[#800000]" />}
          description={`${metrics.totalItems} unique items in catalog`}
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={metrics.lowStockCount.toString()}
          icon={<TrendingDown className="w-5 h-5 text-[#800000]" />}
          description="Items below minimum threshold"
          trend="warning"
        />
        <StatCard 
          title="Out of Stock" 
          value={metrics.outOfStockCount.toString()}
          icon={<AlertTriangle className="w-5 h-5 text-[#800000]" />}
          description="Requires immediate restocking"
          trend="danger"
        />
        <StatCard 
          title="Expiring Soon" 
          value={metrics.expiringSoon.toString()}
          icon={<Archive className="w-5 h-5 text-[#800000]" />}
          description="Batches expiring in 30 days"
          trend="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-[#800000]"><PieChartIcon className="w-5 h-5 mr-2" /> Stock Value by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={valueByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {valueByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #ebd5da', backgroundColor: '#ffffff', color: '#800000' }}
                    itemStyle={{ color: '#800000', fontWeight: 700 }}
                    formatter={(value: any) => `₹${Number(value || 0).toLocaleString('en-IN')}`} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-[#800000]"><BarChart2 className="w-5 h-5 mr-2" /> Operations & Stock Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#fdf5f6] rounded-xl border border-[#ebd5da] hover:border-[#800000] cursor-pointer transition-colors text-center shadow-2xs">
                <RefreshCw className="w-8 h-8 text-[#800000] mx-auto mb-2" />
                <span className="font-bold text-sm text-[#800000] block">Cycle Verification</span>
                <span className="text-[11px] text-[#800000]/70 mt-1 block">Physical stock count</span>
              </div>
              <div className="p-4 bg-[#fdf5f6] rounded-xl border border-[#ebd5da] hover:border-[#800000] cursor-pointer transition-colors text-center shadow-2xs">
                <Package className="w-8 h-8 text-[#800000] mx-auto mb-2" />
                <span className="font-bold text-sm text-[#800000] block">Receive Stock</span>
                <span className="text-[11px] text-[#800000]/70 mt-1 block">GRN & batch intake</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, description, trend }: { title: string, value: string, icon: React.ReactNode, description?: string, trend?: 'success' | 'warning' | 'danger' }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#800000]/70">{title}</p>
          <div className="p-2 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl">
            {icon}
          </div>
        </div>
        <h3 className={`text-2xl lg:text-3xl font-black truncate ${
          trend === 'danger' ? 'text-[#800000]' :
          trend === 'warning' ? 'text-[#800000]' :
          'text-[#800000]'
        }`}>{value}</h3>
        {description && <p className="text-xs text-[#800000]/70 font-semibold mt-2">{description}</p>}
      </CardContent>
    </Card>
  );
}

const IndianRupeeIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/></svg>;
const PieChartIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>;
