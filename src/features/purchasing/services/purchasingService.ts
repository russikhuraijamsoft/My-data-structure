import { collection, query, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Supplier, PurchaseOrder } from '../models/purchasing';
import { db } from '../../../core/firebase/firebaseConfig';

class PurchasingService {
  async getSuppliers(): Promise<Supplier[]> {
    if (!db) {
      return [
        {
          id: 'sup_1',
          name: 'Fresh Farms Produce Ltd',
          category: 'Produce & Veg',
          email: 'orders@freshfarms.in',
          phone: '+91 98765 11111',
          rating: 4.8,
          status: 'ACTIVE',
          paymentTerms: 'Net 15',
          creditLimit: 50000,
          outstandingBalance: 12400,
          address: 'Market Yard Gate 4, Imphal',
          createdAt: new Date().toISOString()
        },
        {
          id: 'sup_2',
          name: 'Apex Poultry & Meats',
          category: 'Poultry & Meat',
          email: 'sales@apexmeats.in',
          phone: '+91 98765 22222',
          rating: 4.9,
          status: 'ACTIVE',
          paymentTerms: 'Net 7',
          creditLimit: 75000,
          outstandingBalance: 24000,
          address: 'Industrial Area Phase 2, Imphal',
          createdAt: new Date().toISOString()
        }
      ];
    }
    try {
      const q = query(collection(db, 'suppliers'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return [
          {
            id: 'sup_1',
            name: 'Fresh Farms Produce Ltd',
            category: 'Produce & Veg',
            email: 'orders@freshfarms.in',
            phone: '+91 98765 11111',
            rating: 4.8,
            status: 'ACTIVE',
            paymentTerms: 'Net 15',
            creditLimit: 50000,
            outstandingBalance: 12400,
            address: 'Market Yard Gate 4, Imphal',
            createdAt: new Date().toISOString()
          },
          {
            id: 'sup_2',
            name: 'Apex Poultry & Meats',
            category: 'Poultry & Meat',
            email: 'sales@apexmeats.in',
            phone: '+91 98765 22222',
            rating: 4.9,
            status: 'ACTIVE',
            paymentTerms: 'Net 7',
            creditLimit: 75000,
            outstandingBalance: 24000,
            address: 'Industrial Area Phase 2, Imphal',
            createdAt: new Date().toISOString()
          }
        ];
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supplier));
    } catch {
      return [];
    }
  }

  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    if (!db) {
      return [
        {
          id: 'po_1',
          poNumber: 'PO-2026-1044',
          supplierId: 'sup_1',
          supplierName: 'Fresh Farms Produce Ltd',
          status: 'APPROVED',
          items: [
            { id: '1', productId: 'inv1', productName: 'Fresh Noodles', quantity: 50, unitPrice: 85, totalPrice: 4250, receivedQuantity: 50, unit: 'kg' }
          ],
          subtotal: 4250,
          taxTotal: 212.5,
          grandTotal: 4462.5,
          expectedDeliveryDate: new Date(Date.now() + 86400000).toISOString(),
          createdAt: new Date().toISOString(),
          createdBy: 'Russi Khuraijam'
        }
      ];
    }
    try {
      const q = query(collection(db, 'purchase_orders'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PurchaseOrder));
    } catch {
      return [];
    }
  }

  async createPurchaseOrder(po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt'>): Promise<PurchaseOrder> {
    const newPO: PurchaseOrder = {
      ...po,
      id: `po_${Date.now()}`,
      poNumber: `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };
    if (db) {
      try {
        await setDoc(doc(db, 'purchase_orders', newPO.id), newPO);
      } catch (err) {
        console.warn("Could not save PO to Firestore:", err);
      }
    }
    return newPO;
  }

  async updatePurchaseOrderStatus(poId: string, status: PurchaseOrder['status']): Promise<void> {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'purchase_orders', poId), { status });
    } catch (err) {
      console.warn("Could not update PO in Firestore:", err);
    }
  }
}

export const purchasingService = new PurchasingService();
