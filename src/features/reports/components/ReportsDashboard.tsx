import React from 'react';
import { useReportsStore } from '../store/reportsStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { TrendingUp, TrendingDown, PieChart as PieChartIcon } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const COLORS = ['#800000', '#9e1234', '#b01b3f', '#d0395c', '#e36a83', '#680016'];

export function ReportsDashboard() {
  const { metrics, salesTrend, expenseBreakdown } = useReportsStore();

  if (!metrics) return null;

  return (
    <div className="space-y-6 text-[#800000]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Today's Revenue" 
          value={`₹${metrics.todaySales.toLocaleString('en-IN')}`}
          icon={<IndianRupeeIcon className="w-5 h-5 text-[#800000]" />}
        />
        <StatCard 
          title="Gross Profit" 
          value={`₹${metrics.grossProfit.toLocaleString('en-IN')}`}
          icon={<TrendingUp className="w-5 h-5 text-[#800000]" />}
        />
        <StatCard 
          title="Food Cost %" 
          value={`${metrics.foodCostPercentage.toFixed(1)}%`}
          icon={<TrendingDown className="w-5 h-5 text-[#800000]" />}
        />
        <StatCard 
          title="Net Profit" 
          value={`₹${metrics.netProfit.toLocaleString('en-IN')}`}
          icon={<PieChartIcon className="w-5 h-5 text-[#800000]" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base text-[#800000]">Sales Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ebd5da" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#800000' }} stroke="#dcabb5" />
                  <YAxis tick={{ fontSize: 12, fill: '#800000' }} stroke="#dcabb5" tickFormatter={(value) => `₹${value/1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #ebd5da', backgroundColor: '#ffffff', color: '#800000' }}
                    itemStyle={{ color: '#800000', fontWeight: 700 }}
                    formatter={(value: any) => [`₹${Number(value || 0).toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Line type="monotone" dataKey="grossRevenue" stroke="#800000" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[#800000]">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="amount"
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #ebd5da', backgroundColor: '#ffffff', color: '#800000' }}
                    formatter={(value: any) => `₹${Number(value || 0).toLocaleString('en-IN')}`} 
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
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

const IndianRupeeIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/></svg>;
