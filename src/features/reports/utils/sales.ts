import type { Order } from '../../pos/models/pos';
import { money } from '../../pos/utils/totals';

export function indiaDay(date: Date | string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(date));
}

export function summarizeSales(orders: Order[], now = new Date()) {
  const today = indiaDay(now);
  const days = Array.from({ length: 7 }, (_, i) => indiaDay(new Date(now.getTime() - (6 - i) * 86400000)));
  const paid = orders.filter(order => order.status === 'PAID' && Number.isFinite(order.total) && Number.isFinite(new Date(order.createdAt).getTime()));
  const salesTrend = days.map(date => {
    const daily = paid.filter(order => indiaDay(order.createdAt) === date);
    const grossRevenue = money(daily.reduce((sum, order) => sum + order.total, 0));
    const netRevenue = money(daily.reduce((sum, order) => sum + order.total - (order.tax || 0), 0));
    return { date, grossRevenue, netRevenue, totalOrders: daily.length, averageBillValue: daily.length ? money(grossRevenue / daily.length) : 0 };
  });
  return {
    today: salesTrend[6],
    weeklySales: money(salesTrend.reduce((sum, day) => sum + day.grossRevenue, 0)),
    monthlySales: money(paid.filter(order => indiaDay(order.createdAt).slice(0, 7) === today.slice(0, 7) && indiaDay(order.createdAt) <= today).reduce((sum, order) => sum + order.total, 0)),
    salesTrend,
  };
}
