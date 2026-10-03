import { collection, query, getDocs } from 'firebase/firestore';
import { SalesReport, ExpenseReport, DashboardMetrics } from '../models/reports';
import { db } from '../../../core/firebase/firebaseConfig';

class ReportsService {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    if (!db) {
      return {
        todaySales: 125000,
        weeklySales: 850000,
        monthlySales: 3500000,
        grossProfit: 2100000,
        netProfit: 850000,
        foodCostPercentage: 28.5,
        labourCostPercentage: 18.2,
        operatingExpenses: 450000
      };
    }
    try {
      const q = query(collection(db, 'reports_metrics'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        return { ...data } as unknown as DashboardMetrics;
      }
      return {
        todaySales: 125000,
        weeklySales: 850000,
        monthlySales: 3500000,
        grossProfit: 2100000,
        netProfit: 850000,
        foodCostPercentage: 28.5,
        labourCostPercentage: 18.2,
        operatingExpenses: 450000
      };
    } catch {
      return {
        todaySales: 125000,
        weeklySales: 850000,
        monthlySales: 3500000,
        grossProfit: 2100000,
        netProfit: 850000,
        foodCostPercentage: 28.5,
        labourCostPercentage: 18.2,
        operatingExpenses: 450000
      };
    }
  }

  async getSalesTrend(): Promise<SalesReport[]> {
    return [
      { date: '19 Sep', grossRevenue: 85000, netRevenue: 80750, totalOrders: 72, averageBillValue: 1180 },
      { date: '20 Sep', grossRevenue: 92000, netRevenue: 87400, totalOrders: 79, averageBillValue: 1164 },
      { date: '21 Sep', grossRevenue: 110000, netRevenue: 104500, totalOrders: 94, averageBillValue: 1170 },
      { date: '22 Sep', grossRevenue: 98000, netRevenue: 93100, totalOrders: 82, averageBillValue: 1195 },
      { date: '23 Sep', grossRevenue: 125000, netRevenue: 118750, totalOrders: 104, averageBillValue: 1201 },
      { date: '24 Sep', grossRevenue: 140000, netRevenue: 133000, totalOrders: 118, averageBillValue: 1186 },
      { date: '25 Sep', grossRevenue: 132000, netRevenue: 125400, totalOrders: 110, averageBillValue: 1200 }
    ];
  }

  async getExpenseBreakdown(): Promise<ExpenseReport[]> {
    return [
      { category: 'Ingredients & Meat', amount: 165000 },
      { category: 'Staff Salaries', amount: 105000 },
      { category: 'Rent & Maintenance', amount: 65000 },
      { category: 'Gas & Electricity', amount: 28000 },
      { category: 'Packaging & Disposables', amount: 18000 },
      { category: 'Marketing & POS Tech', amount: 12000 }
    ];
  }
}

export const reportsService = new ReportsService();
