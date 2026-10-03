import { collection, query, getDocs } from 'firebase/firestore';
import { User, Branch, SystemConfig, AuditLog } from '../models/admin';
import { db } from '../../../core/firebase/firebaseConfig';

class AdminService {
  async getUsers(): Promise<User[]> {
    return [
      { id: 'usr_1', name: 'Russi Khuraijam', email: 'russi.khuraijam@gmail.com', role: 'OWNER', branchIds: ['br_1'], status: 'ACTIVE', lastLogin: new Date().toISOString() },
      { id: 'usr_2', name: 'Suresh Singh', email: 'suresh.s@talkos.in', role: 'CHEF', branchIds: ['br_1'], status: 'ACTIVE', lastLogin: new Date(Date.now() - 3600000).toISOString() },
      { id: 'usr_3', name: 'Bimol Meitei', email: 'bimol.m@talkos.in', role: 'CASHIER', branchIds: ['br_1'], status: 'ACTIVE', lastLogin: new Date(Date.now() - 7200000).toISOString() }
    ];
  }

  async getBranches(): Promise<Branch[]> {
    return [
      { id: 'br_1', name: 'Talk of the Town - Downtown', code: 'TOT-01', address: 'Baza Road, Imphal West', phone: '+91 98765 00001', gstin: '14AAAAA0000A1Z5', status: 'ACTIVE' },
      { id: 'br_2', name: 'Talk of the Town - University Express', code: 'TOT-02', address: 'Canchipur Campus Avenue, Imphal', phone: '+91 98765 00002', gstin: '14AAAAA0000A1Z5', status: 'ACTIVE' }
    ];
  }

  async getSystemConfig(): Promise<SystemConfig> {
    return {
      id: 'cfg_1',
      companyName: 'Talk of the Town Restaurant Group',
      defaultCurrency: 'INR',
      taxType: 'GST (5%)',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12h',
      timezone: 'Asia/Kolkata'
    };
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return [
      { id: 'log_1', userId: 'usr_1', userName: 'Russi Khuraijam', action: 'MENU_UPDATE', module: 'POS', details: 'Added Signature Combo to active menu catalog', timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
      { id: 'log_2', userId: 'usr_1', userName: 'Russi Khuraijam', action: 'PURCHASE_ORDER_APPROVE', module: 'Purchasing', details: 'Approved PO-2026-1044 for Fresh Farms Produce', timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
      { id: 'log_3', userId: 'usr_3', userName: 'Bimol Meitei', action: 'ORDER_SETTLEMENT', module: 'POS', details: 'Processed cash payment of ₹250 for ORD-10024', timestamp: new Date(Date.now() - 60 * 60000).toISOString() }
    ];
  }
}

export const adminService = new AdminService();
