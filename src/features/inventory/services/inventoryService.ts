import { collection, query, getDocs, doc, setDoc, updateDoc, deleteDoc, runTransaction } from 'firebase/firestore';
import { db } from '../../../core/firebase/firebaseConfig';
import { InventoryItem, Category, Warehouse, StockTransaction, ItemBatch, StorageLocation, CycleCount } from '../models/inventory';

class InventoryService {
  async getCategories(): Promise<Category[]> {
    if (!db) {
      return [
        { id: 'cat_1', name: 'Raw Materials', isActive: true, createdAt: new Date().toISOString() },
        { id: 'cat_2', name: 'Meat & Poultry', isActive: true, createdAt: new Date().toISOString() },
        { id: 'cat_3', name: 'Packaging', isActive: true, createdAt: new Date().toISOString() },
        { id: 'cat_4', name: 'Spices & Sauces', isActive: true, createdAt: new Date().toISOString() }
      ];
    }
    try {
      const q = query(collection(db, 'inventory_categories'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        const seedCategories = [
          { name: 'Raw Materials', isActive: true },
          { name: 'Meat & Poultry', isActive: true },
          { name: 'Packaging', isActive: true },
          { name: 'Spices & Sauces', isActive: true }
        ];
        const categories: Category[] = [];
        for (const cat of seedCategories) {
          categories.push(await this.addCategory(cat));
        }
        return categories;
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    } catch {
      return [
        { id: 'cat_1', name: 'Raw Materials', isActive: true, createdAt: new Date().toISOString() },
        { id: 'cat_2', name: 'Meat & Poultry', isActive: true, createdAt: new Date().toISOString() },
        { id: 'cat_3', name: 'Packaging', isActive: true, createdAt: new Date().toISOString() },
        { id: 'cat_4', name: 'Spices & Sauces', isActive: true, createdAt: new Date().toISOString() }
      ];
    }
  }

  async addCategory(categoryData: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    const newCategory: Category = {
      ...categoryData,
      id: `cat_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    if (db) {
      try {
        await setDoc(doc(db, 'inventory_categories', newCategory.id), newCategory);
      } catch (err) {
        console.warn("Could not save category to Firestore:", err);
      }
    }
    return newCategory;
  }

  async getWarehouses(): Promise<Warehouse[]> {
    if (!db) {
      return [
        { id: 'wh_1', name: 'Main Kitchen Store', type: 'MAIN_STORE', location: 'HQ Downtown', isActive: true },
        { id: 'wh_2', name: 'Line Cold Storage', type: 'KITCHEN_STORE', location: 'Prep Line', isActive: true }
      ];
    }
    try {
      const q = query(collection(db, 'inventory_warehouses'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        const mainWarehouse = await this.addWarehouse({
          name: 'Main Kitchen Store',
          type: 'MAIN_STORE',
          location: 'HQ Downtown',
          isActive: true
        });
        return [mainWarehouse];
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Warehouse));
    } catch {
      return [
        { id: 'wh_1', name: 'Main Kitchen Store', type: 'MAIN_STORE', location: 'HQ Downtown', isActive: true }
      ];
    }
  }

  async addWarehouse(warehouseData: Omit<Warehouse, 'id'>): Promise<Warehouse> {
    const newWarehouse: Warehouse = {
      ...warehouseData,
      id: `wh_${Date.now()}`,
    };
    if (db) {
      try {
        await setDoc(doc(db, 'inventory_warehouses', newWarehouse.id), newWarehouse);
      } catch (err) {
        console.warn("Could not save warehouse to Firestore:", err);
      }
    }
    return newWarehouse;
  }

  async getStorageLocations(): Promise<StorageLocation[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'inventory_storage_locations'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StorageLocation));
    } catch {
      return [];
    }
  }

  async addStorageLocation(locationData: Omit<StorageLocation, 'id'>): Promise<StorageLocation> {
    const newLocation: StorageLocation = {
      ...locationData,
      id: `loc_${Date.now()}`,
    };
    if (db) {
      try {
        await setDoc(doc(db, 'inventory_storage_locations', newLocation.id), newLocation);
      } catch (err) {
        console.warn("Could not save storage location to Firestore:", err);
      }
    }
    return newLocation;
  }

  async getItems(): Promise<InventoryItem[]> {
    if (!db) {
      return [
        { id: 'inv1', sku: 'RM-NDL-001', name: 'Fresh Noodles', categoryId: 'cat_1', unit: 'kg', costPrice: 90, sellingPrice: 0, reorderLevel: 20, minimumStock: 10, status: 'ACTIVE', currentStock: 45, valuationMethod: 'WEIGHTED_AVERAGE', lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
        { id: 'inv2', sku: 'RM-CHK-001', name: 'Chicken Breast', categoryId: 'cat_2', unit: 'kg', costPrice: 250, sellingPrice: 0, reorderLevel: 25, minimumStock: 15, status: 'ACTIVE', currentStock: 30, valuationMethod: 'WEIGHTED_AVERAGE', lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
        { id: 'inv3', sku: 'RM-PRK-001', name: 'Pork Meat', categoryId: 'cat_2', unit: 'kg', costPrice: 420, sellingPrice: 0, reorderLevel: 15, minimumStock: 8, status: 'ACTIVE', currentStock: 18, valuationMethod: 'WEIGHTED_AVERAGE', lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
        { id: 'inv4', sku: 'RM-EGG-001', name: 'Eggs (Crate)', categoryId: 'cat_1', unit: 'pcs', costPrice: 6, sellingPrice: 0, reorderLevel: 60, minimumStock: 30, status: 'ACTIVE', currentStock: 120, valuationMethod: 'WEIGHTED_AVERAGE', lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
        { id: 'inv5', sku: 'RM-RCE-001', name: 'Steamed Rice Grain', categoryId: 'cat_1', unit: 'kg', costPrice: 55, sellingPrice: 0, reorderLevel: 50, minimumStock: 20, status: 'ACTIVE', currentStock: 80, valuationMethod: 'WEIGHTED_AVERAGE', lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() }
      ];
    }
    try {
      const q = query(collection(db, 'inventory_items'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        const seedItems = [
          { sku: 'RM-NDL-001', name: 'Fresh Noodles', categoryId: 'cat_1', unit: 'kg', costPrice: 90, sellingPrice: 0, reorderLevel: 20, minimumStock: 10, status: 'ACTIVE' as const, valuationMethod: 'WEIGHTED_AVERAGE' as const },
          { sku: 'RM-CHK-001', name: 'Chicken Breast', categoryId: 'cat_2', unit: 'kg', costPrice: 250, sellingPrice: 0, reorderLevel: 25, minimumStock: 15, status: 'ACTIVE' as const, valuationMethod: 'WEIGHTED_AVERAGE' as const },
          { sku: 'RM-PRK-001', name: 'Pork Meat', categoryId: 'cat_2', unit: 'kg', costPrice: 420, sellingPrice: 0, reorderLevel: 15, minimumStock: 8, status: 'ACTIVE' as const, valuationMethod: 'WEIGHTED_AVERAGE' as const }
        ];
        const res: InventoryItem[] = [];
        for (const item of seedItems) {
          res.push(await this.addItem(item));
        }
        return res;
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
    } catch {
      return [];
    }
  }

  async addItem(itemData: Omit<InventoryItem, 'id' | 'lastUpdated' | 'createdAt' | 'currentStock'>): Promise<InventoryItem> {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv_${Date.now()}`,
      currentStock: 50,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    if (db) {
      try {
        await setDoc(doc(db, 'inventory_items', newItem.id), newItem);
      } catch (err) {
        console.warn("Could not save item to Firestore:", err);
      }
    }
    return newItem;
  }

  async updateItem(id: string, data: Partial<InventoryItem>): Promise<void> {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'inventory_items', id), { ...data, lastUpdated: new Date().toISOString() });
    } catch (err) {
      console.warn("Could not update item in Firestore:", err);
    }
  }

  async deleteItem(id: string): Promise<void> {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'inventory_items', id));
    } catch (err) {
      console.warn("Could not delete item in Firestore:", err);
    }
  }

  async getBatches(): Promise<ItemBatch[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'inventory_batches'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ItemBatch));
    } catch {
      return [];
    }
  }

  async addBatch(batchData: Omit<ItemBatch, 'id'>): Promise<ItemBatch> {
    const newBatch: ItemBatch = {
      ...batchData,
      id: `bat_${Date.now()}`
    };
    if (db) {
      try {
        await setDoc(doc(db, 'inventory_batches', newBatch.id), newBatch);
      } catch (err) {
        console.warn("Could not save batch to Firestore:", err);
      }
    }
    return newBatch;
  }

  async updateBatch(id: string, data: Partial<ItemBatch>): Promise<void> {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'inventory_batches', id), data);
    } catch (err) {
      console.warn("Could not update batch in Firestore:", err);
    }
  }

  async getCycleCounts(): Promise<CycleCount[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'inventory_cycle_counts'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CycleCount));
    } catch {
      return [];
    }
  }

  async addCycleCount(countData: Omit<CycleCount, 'id' | 'createdAt'>): Promise<CycleCount> {
    const newCount: CycleCount = {
      ...countData,
      id: `cc_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    if (db) {
      try {
        await setDoc(doc(db, 'inventory_cycle_counts', newCount.id), newCount);
      } catch (err) {
        console.warn("Could not save cycle count to Firestore:", err);
      }
    }
    return newCount;
  }

  async updateCycleCount(id: string, data: Partial<CycleCount>): Promise<void> {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'inventory_cycle_counts', id), data);
    } catch (err) {
      console.warn("Could not update cycle count in Firestore:", err);
    }
  }

  async recordTransaction(transactionData: Omit<StockTransaction, 'id' | 'date'>): Promise<StockTransaction> {
    const newTransaction: StockTransaction = {
      ...transactionData,
      id: `txn_${Date.now()}`,
      date: new Date().toISOString()
    };

    if (db) {
      try {
        await runTransaction(db, async (transaction) => {
          const itemRef = doc(db, 'inventory_items', newTransaction.itemId);
          const itemDoc = await transaction.get(itemRef);
          
          if (itemDoc.exists()) {
            const itemData = itemDoc.data() as InventoryItem;
            const currentStock = itemData.currentStock || 0;
            let stockChange = 0;
            
            switch (newTransaction.type) {
              case 'STOCK_IN':
              case 'RETURN':
              case 'OPENING':
                stockChange = newTransaction.quantity;
                break;
              case 'STOCK_OUT':
              case 'DAMAGE':
              case 'WASTAGE':
              case 'EXPIRY':
                stockChange = -newTransaction.quantity;
                break;
              case 'ADJUSTMENT':
              case 'PHYSICAL_VERIFICATION':
                stockChange = newTransaction.quantity;
                break;
            }

            const newStock = Math.max(0, currentStock + stockChange);
            transaction.update(itemRef, { 
              currentStock: newStock,
              lastUpdated: new Date().toISOString()
            });
          }

          const txnRef = doc(db, 'inventory_transactions', newTransaction.id);
          transaction.set(txnRef, newTransaction);
        });
      } catch (err) {
        console.warn("Could not record stock transaction in Firestore:", err);
      }
    }

    return newTransaction;
  }
}

export const inventoryService = new InventoryService();
