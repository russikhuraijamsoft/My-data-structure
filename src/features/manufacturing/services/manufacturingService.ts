import { collection, query, getDocs, doc, setDoc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../../../core/firebase/firebaseConfig';
import { Recipe, ProductionOrder } from '../models/manufacturing';

class ManufacturingService {
  private recipesCollection = 'manufacturing_recipes';
  private ordersCollection = 'manufacturing_orders';

  async getRecipes(): Promise<Recipe[]> {
    if (!db) {
      return [
        {
          id: 'r1',
          name: 'Classic Chicken Chowmein Base',
          description: 'Wok-tossed noodles with shredded chicken and oriental seasoning',
          categoryId: 'chowmein',
          version: '1.0',
          status: 'ACTIVE',
          yieldQuantity: 10,
          yieldUnit: 'portions',
          servingSize: '1 portion',
          prepTimeMinutes: 15,
          cookTimeMinutes: 10,
          shelfLifeDays: 1,
          ingredients: [
            { id: 'i1', inventoryItemId: 'inv1', itemName: 'Fresh Noodles', quantity: 2, unit: 'kg', isOptional: false, costPerUnit: 90 },
            { id: 'i2', inventoryItemId: 'inv2', itemName: 'Chicken Breast', quantity: 1, unit: 'kg', isOptional: false, costPerUnit: 250 }
          ],
          instructions: [
            { step: 1, description: 'Boil and strain noodles with touch of oil', timeMinutes: 5 },
            { step: 2, description: 'Wok fry chicken with aromatics and toss', timeMinutes: 10 }
          ],
          costing: {
            ingredientsCost: 435,
            gasCost: 6.32,
            electricityCost: 1.00,
            waterCost: 0.50,
            labourCost: 37.50,
            packagingCost: 5.00,
            overheadCost: 2.00,
            totalCost: 487.32,
            sellingPrice: 700,
            costPerPortion: 48.73,
            grossProfit: 212.68,
            marginPercentage: 30.4
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
    try {
      const q = query(collection(db, this.recipesCollection), orderBy('updatedAt', 'desc'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return [
          {
            id: 'r1',
            name: 'Classic Chicken Chowmein Base',
            description: 'Wok-tossed noodles with shredded chicken and oriental seasoning',
            categoryId: 'chowmein',
            version: '1.0',
            status: 'ACTIVE',
            yieldQuantity: 10,
            yieldUnit: 'portions',
            servingSize: '1 portion',
            prepTimeMinutes: 15,
            cookTimeMinutes: 10,
            shelfLifeDays: 1,
            ingredients: [
              { id: 'i1', inventoryItemId: 'inv1', itemName: 'Fresh Noodles', quantity: 2, unit: 'kg', isOptional: false, costPerUnit: 90 },
              { id: 'i2', inventoryItemId: 'inv2', itemName: 'Chicken Breast', quantity: 1, unit: 'kg', isOptional: false, costPerUnit: 250 }
            ],
            instructions: [
              { step: 1, description: 'Boil and strain noodles with touch of oil', timeMinutes: 5 },
              { step: 2, description: 'Wok fry chicken with aromatics and toss', timeMinutes: 10 }
            ],
            costing: {
              ingredientsCost: 435,
              gasCost: 6.32,
              electricityCost: 1.00,
              waterCost: 0.50,
              labourCost: 37.50,
              packagingCost: 5.00,
              overheadCost: 2.00,
              totalCost: 487.32,
              sellingPrice: 700,
              costPerPortion: 48.73,
              grossProfit: 212.68,
              marginPercentage: 30.4
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe));
    } catch {
      return [];
    }
  }

  async getProductionOrders(): Promise<ProductionOrder[]> {
    if (!db) {
      return [
        {
          id: 'po1',
          recipeId: 'r1',
          recipeName: 'Classic Chicken Chowmein Base',
          batchNumber: 'BCH-2026-001',
          plannedQuantity: 20,
          unit: 'portions',
          plannedDate: new Date().toISOString(),
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
    try {
      const q = query(collection(db, this.ordersCollection), orderBy('updatedAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductionOrder));
    } catch {
      return [];
    }
  }

  async addRecipe(data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
    const id = `rec_${Date.now()}`;
    const now = new Date().toISOString();
    const newRecipe: Recipe = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    };
    if (db) {
      try {
        await setDoc(doc(db, this.recipesCollection, id), newRecipe);
      } catch (err) {
        console.warn("Could not save recipe to Firestore:", err);
      }
    }
    return newRecipe;
  }

  async updateRecipe(id: string, data: Partial<Recipe>): Promise<void> {
    if (!db) return;
    try {
      await updateDoc(doc(db, this.recipesCollection, id), {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Could not update recipe in Firestore:", err);
    }
  }

  async addProductionOrder(data: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductionOrder> {
    const id = `po_${Date.now()}`;
    const now = new Date().toISOString();
    const newOrder: ProductionOrder = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    };
    if (db) {
      try {
        await setDoc(doc(db, this.ordersCollection, id), newOrder);
      } catch (err) {
        console.warn("Could not save production order to Firestore:", err);
      }
    }
    return newOrder;
  }

  async updateProductionOrder(id: string, data: Partial<ProductionOrder>): Promise<void> {
    if (!db) return;
    try {
      await updateDoc(doc(db, this.ordersCollection, id), {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Could not update production order in Firestore:", err);
    }
  }
}

export const manufacturingService = new ManufacturingService();
