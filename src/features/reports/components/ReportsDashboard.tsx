import React from 'react';
import { useReportsStore } from '../store/reportsStore';

const rupees = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
export function ReportsDashboard() {
  const { sales } = useReportsStore();
  if (!sales) return null;
  return <section className="space-y-6 text-[#800000]">
    <p className="text-sm">Saved paid orders · India time · Bill totals include tax. Cancelled and refunded orders are excluded.</p>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[["Today's sales", rupees(sales.today.grossRevenue)], ['Paid orders today', sales.today.totalOrders], ['Last 7 days', rupees(sales.weeklySales)], ['This month', rupees(sales.monthlySales)]].map(([label, value]) =>
        <div key={label} className="rounded-xl bg-white border border-[#ebd5da] p-4"><p className="text-sm">{label}</p><strong className="text-xl">{value}</strong></div>)}
    </div>
    <div className="overflow-x-auto rounded-xl border border-[#ebd5da] bg-white">
      <table className="w-full text-sm text-right"><caption className="p-4 text-left font-bold">Sales for the last seven days</caption>
        <thead><tr>{['Date', 'Paid orders', 'Bill total', 'Excluding tax', 'Average bill'].map(label => <th key={label} className="p-3">{label}</th>)}</tr></thead>
        <tbody>{sales.salesTrend.map(day => <tr key={day.date} className="border-t border-[#ebd5da]">
          <td className="p-3">{day.date}</td><td className="p-3">{day.totalOrders}</td><td className="p-3">{rupees(day.grossRevenue)}</td><td className="p-3">{rupees(day.netRevenue)}</td><td className="p-3">{rupees(day.averageBillValue)}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <p className="text-sm">Profit and expense reporting will be available after verified costs and expenses are connected.</p>
  </section>;
}
