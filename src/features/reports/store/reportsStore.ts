import { create } from 'zustand';
import { reportsService } from '../services/reportsService';
import type { summarizeSales } from '../utils/sales';

interface ReportsState {
  sales: ReturnType<typeof summarizeSales> | null;
  loading: boolean;
  error: string | null;
  loadReports: () => Promise<void>;
}
export const useReportsStore = create<ReportsState>((set) => ({
  sales: null, loading: false, error: null,
  loadReports: async () => {
    set({ loading: true, error: null });
    try {
      const sales = await reportsService.loadSales();
      set({ sales, loading: false });
    } catch (error) {
      set({ sales: null, loading: false, error: error instanceof Error ? error.message : 'Could not load saved orders.' });
    }
  },
}));
