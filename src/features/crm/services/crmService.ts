import { collection, query, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Customer, Promotion } from '../models/crm';
import { db } from '../../../core/firebase/firebaseConfig';

class CrmService {
  async getCustomers(): Promise<Customer[]> {
    if (!db) {
      return [
        {
          id: 'cust_1',
          firstName: 'Anand',
          lastName: 'Sharma',
          email: 'anand.sharma@example.com',
          phone: '+91 98765 33333',
          loyaltyPoints: 340,
          tier: 'GOLD',
          status: 'ACTIVE',
          totalVisits: 14,
          totalSpent: 4200,
          createdAt: new Date().toISOString()
        },
        {
          id: 'cust_2',
          firstName: 'Priya',
          lastName: 'Devi',
          email: 'priya.devi@example.com',
          phone: '+91 98765 44444',
          loyaltyPoints: 120,
          tier: 'SILVER',
          status: 'ACTIVE',
          totalVisits: 6,
          totalSpent: 1650,
          createdAt: new Date().toISOString()
        }
      ];
    }
    try {
      const q = query(collection(db, 'customers'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return [
          {
            id: 'cust_1',
            firstName: 'Anand',
            lastName: 'Sharma',
            email: 'anand.sharma@example.com',
            phone: '+91 98765 33333',
            loyaltyPoints: 340,
            tier: 'GOLD',
            status: 'ACTIVE',
            totalVisits: 14,
            totalSpent: 4200,
            createdAt: new Date().toISOString()
          },
          {
            id: 'cust_2',
            firstName: 'Priya',
            lastName: 'Devi',
            email: 'priya.devi@example.com',
            phone: '+91 98765 44444',
            loyaltyPoints: 120,
            tier: 'SILVER',
            status: 'ACTIVE',
            totalVisits: 6,
            totalSpent: 1650,
            createdAt: new Date().toISOString()
          }
        ];
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
    } catch {
      return [];
    }
  }

  async getPromotions(): Promise<Promotion[]> {
    if (!db) {
      return [
        {
          id: 'promo_1',
          code: 'WELCOME10',
          name: 'Welcome Discount',
          description: '10% off on first order',
          type: 'PERCENTAGE',
          value: 10,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
          isActive: true,
          timesUsed: 42
        },
        {
          id: 'promo_2',
          code: 'COMBO50',
          name: 'Weekend Combo Saver',
          description: '₹50 flat discount on Family Combos',
          type: 'FIXED',
          value: 50,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 15 * 86400000).toISOString(),
          isActive: true,
          timesUsed: 19
        }
      ];
    }
    try {
      const q = query(collection(db, 'promotions'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion));
    } catch {
      return [];
    }
  }

  async addCustomer(customerData: Omit<Customer, 'id' | 'createdAt' | 'loyaltyPoints' | 'tier' | 'status' | 'totalVisits' | 'totalSpent'>): Promise<Customer> {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust_${Date.now()}`,
      createdAt: new Date().toISOString(),
      loyaltyPoints: 0,
      tier: 'BRONZE',
      status: 'ACTIVE',
      totalVisits: 0,
      totalSpent: 0,
    };
    if (db) {
      try {
        await setDoc(doc(db, 'customers', newCustomer.id), newCustomer);
      } catch (err) {
        console.warn("Could not save customer to Firestore:", err);
      }
    }
    return newCustomer;
  }
}

export const crmService = new CrmService();
