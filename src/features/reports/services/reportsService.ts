import { posService } from '../../pos/services/posService';
import { summarizeSales } from '../utils/sales';

class ReportsService {
  async loadSales() {
    return summarizeSales(await posService.getOrders());
  }
}
export const reportsService = new ReportsService();
