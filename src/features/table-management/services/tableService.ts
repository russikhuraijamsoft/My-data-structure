import { collection, query, getDocs, doc, setDoc, updateDoc, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../../core/firebase/firebaseConfig';
import { Floor, Table, Reservation, WaitlistEntry } from '../models/table';

class TableService {
  async getFloors(): Promise<Floor[]> {
    if (!db) {
      return [
        { id: 'f1', name: 'Main Hall', zone: 'Indoor', isActive: true, order: 1 },
        { id: 'f2', name: 'Terrace', zone: 'Outdoor', isActive: true, order: 2 }
      ];
    }
    try {
      const q = query(collection(db, 'table_floors'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        const seedFloors = [
          { id: 'f1', name: 'Main Hall', zone: 'Indoor', isActive: true, order: 1 },
          { id: 'f2', name: 'Terrace', zone: 'Outdoor', isActive: true, order: 2 }
        ];
        for (const floor of seedFloors) {
          await setDoc(doc(db, 'table_floors', floor.id), floor);
        }
        return seedFloors;
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Floor)).sort((a, b) => a.order - b.order);
    } catch {
      return [
        { id: 'f1', name: 'Main Hall', zone: 'Indoor', isActive: true, order: 1 },
        { id: 'f2', name: 'Terrace', zone: 'Outdoor', isActive: true, order: 2 }
      ];
    }
  }

  async getTables(): Promise<Table[]> {
    if (!db) {
      return [
        { id: 't1', floorId: 'f1', tableNumber: '1', capacity: 2, shape: 'SQUARE', positionX: 50, positionY: 50, width: 60, height: 60, status: 'AVAILABLE', locked: false },
        { id: 't2', floorId: 'f1', tableNumber: '2', capacity: 4, shape: 'RECTANGLE', positionX: 150, positionY: 50, width: 100, height: 60, status: 'OCCUPIED', locked: false },
        { id: 't3', floorId: 'f1', tableNumber: '3', capacity: 4, shape: 'ROUND', positionX: 300, positionY: 50, width: 80, height: 80, status: 'RESERVED', locked: false },
        { id: 't4', floorId: 'f2', tableNumber: '10', capacity: 2, shape: 'SQUARE', positionX: 50, positionY: 50, width: 60, height: 60, status: 'AVAILABLE', locked: false }
      ];
    }
    try {
      const q = query(collection(db, 'table_items'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        const seedTables: Table[] = [
          { id: 't1', floorId: 'f1', tableNumber: '1', capacity: 2, shape: 'SQUARE', positionX: 50, positionY: 50, width: 60, height: 60, status: 'AVAILABLE', locked: false },
          { id: 't2', floorId: 'f1', tableNumber: '2', capacity: 4, shape: 'RECTANGLE', positionX: 150, positionY: 50, width: 100, height: 60, status: 'OCCUPIED', locked: false },
          { id: 't3', floorId: 'f1', tableNumber: '3', capacity: 4, shape: 'ROUND', positionX: 300, positionY: 50, width: 80, height: 80, status: 'RESERVED', locked: false },
          { id: 't4', floorId: 'f2', tableNumber: '10', capacity: 2, shape: 'SQUARE', positionX: 50, positionY: 50, width: 60, height: 60, status: 'AVAILABLE', locked: false }
        ];
        for (const table of seedTables) {
          await setDoc(doc(db, 'table_items', table.id), table);
        }
        return seedTables;
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Table));
    } catch {
      return [
        { id: 't1', floorId: 'f1', tableNumber: '1', capacity: 2, shape: 'SQUARE', positionX: 50, positionY: 50, width: 60, height: 60, status: 'AVAILABLE', locked: false },
        { id: 't2', floorId: 'f1', tableNumber: '2', capacity: 4, shape: 'RECTANGLE', positionX: 150, positionY: 50, width: 100, height: 60, status: 'OCCUPIED', locked: false },
        { id: 't3', floorId: 'f1', tableNumber: '3', capacity: 4, shape: 'ROUND', positionX: 300, positionY: 50, width: 80, height: 80, status: 'RESERVED', locked: false },
        { id: 't4', floorId: 'f2', tableNumber: '10', capacity: 2, shape: 'SQUARE', positionX: 50, positionY: 50, width: 60, height: 60, status: 'AVAILABLE', locked: false }
      ];
    }
  }

  async getReservations(dateStr: string): Promise<Reservation[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'table_reservations'), where('date', '==', dateStr));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
    } catch {
      return [];
    }
  }

  async getWaitlist(): Promise<WaitlistEntry[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'table_waitlist'), where('status', '==', 'WAITING'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WaitlistEntry));
    } catch {
      return [];
    }
  }

  async updateTable(id: string, data: Partial<Table>): Promise<void> {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'table_items', id), data);
    } catch (err) {
      console.warn("Could not update table in Firestore:", err);
    }
  }

  async addTable(data: Omit<Table, 'id'>): Promise<Table> {
    const newTable: Table = {
      ...data,
      id: `tbl_${Date.now()}`
    };
    if (db) {
      try {
        await setDoc(doc(db, 'table_items', newTable.id), newTable);
      } catch (err) {
        console.warn("Could not save table to Firestore:", err);
      }
    }
    return newTable;
  }

  async addReservation(data: Omit<Reservation, 'id' | 'createdAt'>): Promise<Reservation> {
    const newReservation: Reservation = {
      ...data,
      id: `res_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    if (db) {
      try {
        await setDoc(doc(db, 'table_reservations', newReservation.id), newReservation);
      } catch (err) {
        console.warn("Could not save reservation to Firestore:", err);
      }
    }
    return newReservation;
  }

  async addFloor(data: Omit<Floor, 'id'>): Promise<Floor> {
    const newFloor: Floor = {
      ...data,
      id: `flr_${Date.now()}`
    };
    if (db) {
      try {
        await setDoc(doc(db, 'table_floors', newFloor.id), newFloor);
      } catch (err) {
        console.warn("Could not save floor to Firestore:", err);
      }
    }
    return newFloor;
  }
}

export const tableService = new TableService();
