import { collection, query, getDocs, doc, setDoc } from 'firebase/firestore';
import { Account, Transaction } from '../models/finance';
import { db } from '../../../core/firebase/firebaseConfig';

class FinanceService {
  async getAccounts(): Promise<Account[]> {
    if (!db) {
      return [
        { id: 'acc_1', code: '1001', name: 'Cash in Register', type: 'ASSET', group: 'CURRENT_ASSET', balance: 45000, isActive: true },
        { id: 'acc_2', code: '1002', name: 'HDFC Current Bank Account', type: 'ASSET', group: 'CURRENT_ASSET', balance: 280000, isActive: true },
        { id: 'acc_3', code: '4001', name: 'Food & Beverage Sales Revenue', type: 'INCOME', group: 'REVENUE', balance: 520000, isActive: true },
        { id: 'acc_4', code: '5001', name: 'Raw Material & Ingredient Cost', type: 'EXPENSE', group: 'COST_OF_SALES', balance: 165000, isActive: true },
        { id: 'acc_5', code: '5002', name: 'Utility & LPG Expense', type: 'EXPENSE', group: 'OPERATING_EXPENSE', balance: 24000, isActive: true },
        { id: 'acc_6', code: '5003', name: 'Store Rent & Maintenance', type: 'EXPENSE', group: 'OPERATING_EXPENSE', balance: 65000, isActive: true }
      ];
    }
    try {
      const q = query(collection(db, 'finance_accounts'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return [
          { id: 'acc_1', code: '1001', name: 'Cash in Register', type: 'ASSET', group: 'CURRENT_ASSET', balance: 45000, isActive: true },
          { id: 'acc_2', code: '1002', name: 'HDFC Current Bank Account', type: 'ASSET', group: 'CURRENT_ASSET', balance: 280000, isActive: true },
          { id: 'acc_3', code: '4001', name: 'Food & Beverage Sales Revenue', type: 'INCOME', group: 'REVENUE', balance: 520000, isActive: true },
          { id: 'acc_4', code: '5001', name: 'Raw Material & Ingredient Cost', type: 'EXPENSE', group: 'COST_OF_SALES', balance: 165000, isActive: true },
          { id: 'acc_5', code: '5002', name: 'Utility & LPG Expense', type: 'EXPENSE', group: 'OPERATING_EXPENSE', balance: 24000, isActive: true }
        ];
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Account));
    } catch {
      return [];
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    if (!db) {
      return [
        {
          id: 'txn_1',
          date: new Date().toISOString(),
          reference: 'JE-2026-0042',
          description: 'Daily Point of Sale Settlement & Cash Up',
          status: 'POSTED',
          lines: [
            { id: 'l1', accountId: 'acc_1', accountName: 'Cash in Register', debit: 45000, credit: 0 },
            { id: 'l2', accountId: 'acc_3', accountName: 'Sales Revenue', debit: 0, credit: 45000 }
          ],
          totalDebit: 45000,
          totalCredit: 45000,
          createdBy: 'Russi Khuraijam',
          createdAt: new Date().toISOString()
        }
      ];
    }
    try {
      const q = query(collection(db, 'finance_transactions'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
    } catch {
      return [];
    }
  }
}

export const financeService = new FinanceService();
