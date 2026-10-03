import { collection, query, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../core/firebase/firebaseConfig';
import { Product, Order, MenuItemSize } from '../models/pos';
import { INITIAL_MENU_ITEMS, getAllMenuItemSizes } from '../data/menuData';

class PosService {
  private hasInitializedMenu = false;

  async getProducts(): Promise<Product[]> {
    if (!db) {
      return INITIAL_MENU_ITEMS;
    }
    try {
      const q = query(collection(db, 'pos_products'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty || !this.hasInitializedMenu) {
        await this.syncInitialMenu(snapshot.empty);
        this.hasInitializedMenu = true;
        const updatedSnap = await getDocs(q);
        if (!updatedSnap.empty) {
          return updatedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        }
      }

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
    if (!db) return this.localOrders;
    try {
      const q = query(collection(db, 'pos_orders'));
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (orders.length > 0) {
        this.localOrders = orders;
        return orders;
      }
      return this.localOrders;
    } catch (err) {
      console.warn("Falling back to local orders due to error:", err);
      return this.localOrders;
    }
  }

  async updateOrderStatus(orderId: string, status: Order['status'], voidReason?: string): Promise<void> {
    const orderIndex = this.localOrders.findIndex(o => o.id === orderId);
    if (orderIndex > -1) {
      this.localOrders[orderIndex] = {
        ...this.localOrders[orderIndex],
        status,
        ...(voidReason ? { voidReason } : {})
      };
    }
    if (db) {
      try {
        await updateDoc(doc(db, 'pos_orders', orderId), {
          status,
          ...(voidReason ? { voidReason } : {}),
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn("Could not update order status in Firestore:", err);
      }
    }
  }

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'orderNumber'>): Promise<Order> {
    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString()
    };
    this.localOrders.unshift(newOrder);
    if (db) {
      try {
        await setDoc(doc(db, 'pos_orders', newOrder.id), newOrder);
      } catch (err) {
        console.warn("Could not save order to Firestore:", err);
      }
    }
    return newOrder;
  }
}

export const posService = new PosService();
