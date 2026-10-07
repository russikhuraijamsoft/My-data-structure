import { collection, query, getDocs, doc, setDoc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../../../core/firebase/firebaseConfig';
import { Recipe, ProductionOrder } from '../models/manufacturing';

class ManufacturingService {
  private recipesCollection = 'manufacturing_recipes';
  private ordersCollection = 'manufacturing_orders';

  async getRecipes(): Promise<Recipe[]> {
    if (!db) throw new Error('Recipe storage is unavailable.');
    try {
      const q = query(collection(db, this.recipesCollection), orderBy('updatedAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(recipeDoc => ({ id: recipeDoc.id, ...recipeDoc.data() } as Recipe));
    } catch (error) {
      throw new Error(`Could not load inventory recipes: ${error instanceof Error ? error.message : String(error)}`);
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
