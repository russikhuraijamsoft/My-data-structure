import { collection, query, getDocs, doc, setDoc, updateDoc, writeBatch, runTransaction } from 'firebase/firestore';
import { db } from '../../../core/firebase/firebaseConfig';
import type { Ticket } from '../../kds/models/kds';
import { Product, Order, MenuItemSize } from '../models/pos';
import { INITIAL_MENU_ITEMS, getAllMenuItemSizes } from '../data/menuData';

class PosService {

  async getProducts(): Promise<Product[]> {
    if (!db) {
      return INITIAL_MENU_ITEMS;
    }
    try {
      const q = query(collection(db, 'pos_products'));
      const snapshot = await getDocs(q);
      
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      return products.length > 0 ? products : INITIAL_MENU_ITEMS;
    } catch (error) {
      console.warn("Falling back to local menu items due to Firestore fetch error:", error);
      return INITIAL_MENU_ITEMS;
    }
  }

  async syncInitialMenu(isCollectionEmpty = false): Promise<void> {
    if (!db) return;
    try {
      for (const item of INITIAL_MENU_ITEMS) {
        await setDoc(doc(db, 'pos_products', item.id), item, { merge: true });
      }
      const allSizes = getAllMenuItemSizes();
      for (const size of allSizes) {
        const sizeDocId = size.id || `${size.item_id}_${size.size.toLowerCase()}`;
        await setDoc(doc(db, 'menu_item_sizes', sizeDocId), size, { merge: true });
      }
    } catch (err) {
      console.warn("Could not sync menu items to Firestore:", err);
    }
  }

  async getMenuItemSizes(itemId?: string): Promise<MenuItemSize[]> {
    if (!db) {
      const sizes = getAllMenuItemSizes();
      return itemId ? sizes.filter(s => s.item_id === itemId) : sizes;
    }
    try {
      const q = query(collection(db, 'menu_item_sizes'));
      const snapshot = await getDocs(q);
      const sizes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItemSize));
      return itemId ? sizes.filter(s => s.item_id === itemId) : sizes;
    } catch {
      const sizes = getAllMenuItemSizes();
      return itemId ? sizes.filter(s => s.item_id === itemId) : sizes;
    }
  }

  async addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`
    };
    if (db) {
      await setDoc(doc(db, 'pos_products', newProduct.id), newProduct);
      if (newProduct.sizes) {
        for (const s of newProduct.sizes) {
          const sizeDocId = `${newProduct.id}_${s.size.toLowerCase()}`;
          await setDoc(doc(db, 'menu_item_sizes', sizeDocId), {
            ...s,
            id: sizeDocId,
            item_id: newProduct.id
          });
        }
      }
    }
    return newProduct;
  }

  private localOrders: Order[] = [];

  async getOrders(): Promise<Order[]> {
    if (!db) throw new Error("Order storage is unavailable. Check Firebase configuration.");
    try {
      const q = query(collection(db, 'pos_orders'));
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.localOrders = orders;
      return orders;
    } catch (err) {
      console.warn("Could not load orders:", err);
      throw err;
    }
  }

  async updateOrderStatus(orderId: string, status: Order['status'], voidReason?: string): Promise<void> {
    if (!db) throw new Error('Order storage is unavailable.');
    await runTransaction(db, async transaction => {
      const orderRef = doc(db, 'pos_orders', orderId);
      const ticketRef = doc(db, 'tickets', `ticket_${orderId}`);
      const ticket = await transaction.get(ticketRef);
      transaction.update(orderRef, { status, ...(voidReason ? { voidReason } : {}), updatedAt: new Date().toISOString() });
      if (ticket.exists() && (status === 'CANCELLED' || status === 'REFUNDED')) {
        transaction.update(ticketRef, { status: 'CANCELLED' });
      }
    });
    this.localOrders = this.localOrders.map(order => order.id === orderId
      ? { ...order, status, ...(voidReason ? { voidReason } : {}) } : order);
  }

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'orderNumber'>): Promise<Order> {
    if (!db) throw new Error('Order storage is unavailable. Your cart has been kept.');
    const newOrder: Order = {
      ...orderData,
      id: `ord_${crypto.randomUUID()}`,
      orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString()
    };
    // JSON removes optional undefined fields that Firestore rejects, including nested items.
    const ticket: Ticket = {
      id: `ticket_${newOrder.id}`,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      type: newOrder.orderType || 'DINE_IN',
      tableNumber: newOrder.tableNumber,
      customerName: newOrder.customerName,
      status: 'NEW',
      priority: 'NORMAL',
      createdAt: newOrder.createdAt,
      targetTime: new Date(Date.now() + 20 * 60000).toISOString(),
      items: newOrder.items.map((item, index) => ({
        id: `${newOrder.id}_${index}`,
        productId: item.productId,
        productName: item.name,
        size: item.size,
        quantity: item.quantity,
        modifiers: item.selectedOption ? [item.selectedOption] : [],
        notes: item.notes || newOrder.orderNotes,
        stationId: 'st_1',
        status: 'PENDING'
      }))
    };
    const batch = writeBatch(db);
    batch.set(doc(db, 'pos_orders', newOrder.id), JSON.parse(JSON.stringify(newOrder)));
    batch.set(doc(db, 'tickets', ticket.id), JSON.parse(JSON.stringify(ticket)));
    await batch.commit();
    this.localOrders.unshift(newOrder);
    return newOrder;
  }
}

export const posService = new PosService();
