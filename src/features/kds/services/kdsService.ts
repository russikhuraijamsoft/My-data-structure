import { collection, query, where, onSnapshot, doc, updateDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { Ticket, Station, TicketItemStatus, OrderStatus, TicketItem } from '../models/kds';
import { db } from '../../../core/firebase/firebaseConfig';

class KdsService {
  async getStations(): Promise<Station[]> {
    if (!db) {
      return [
        { id: 'st_1', name: 'Main Kitchen', type: 'KITCHEN', isActive: true },
        { id: 'st_2', name: 'Prep / Assembly', type: 'KITCHEN', isActive: true },
        { id: 'st_3', name: 'Beverage Bar', type: 'BAR', isActive: true },
        { id: 'st_5', name: 'Expeditor', type: 'EXPEDITOR', isActive: true }
      ];
    }
    try {
      const q = query(collection(db, 'stations'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return [
          { id: 'st_1', name: 'Main Kitchen', type: 'KITCHEN', isActive: true },
          { id: 'st_2', name: 'Prep / Assembly', type: 'KITCHEN', isActive: true },
          { id: 'st_3', name: 'Beverage Bar', type: 'BAR', isActive: true },
          { id: 'st_5', name: 'Expeditor', type: 'EXPEDITOR', isActive: true }
        ];
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Station));
    } catch {
      return [
        { id: 'st_1', name: 'Main Kitchen', type: 'KITCHEN', isActive: true },
        { id: 'st_2', name: 'Prep / Assembly', type: 'KITCHEN', isActive: true },
        { id: 'st_3', name: 'Beverage Bar', type: 'BAR', isActive: true },
        { id: 'st_5', name: 'Expeditor', type: 'EXPEDITOR', isActive: true }
      ];
    }
  }

  subscribeToTickets(stationId: string | null, callback: (tickets: Ticket[]) => void, onError: (error: Error) => void): () => void {
    if (!db) {
      const mockTickets: Ticket[] = [
        {
          id: 't_1',
          orderId: 'ord_1',
          orderNumber: 'ORD-10024',
          tableNumber: 'Table 4',
          type: 'DINE_IN',
          status: 'NEW',
          items: [
            { id: 'ti_1', productId: 'prod_chow_chicken', productName: 'Chicken Chowmein • Medium', size: 'Medium', quantity: 2, status: 'PENDING', stationId: 'st_1', modifiers: [], notes: 'Extra spicy' },
            { id: 'ti_2', productId: 'prod_fr_chicken', productName: 'Chicken Fried Rice • Small', size: 'Small', quantity: 1, status: 'PENDING', stationId: 'st_1', modifiers: [] }
          ],
          createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
          targetTime: new Date(Date.now() + 15 * 60000).toISOString(),
          priority: 'NORMAL'
        },
        {
          id: 't_2',
          orderId: 'ord_2',
          orderNumber: 'ORD-10025',
          tableNumber: 'Table 2',
          type: 'DINE_IN',
          status: 'PREPARING',
          items: [
            { id: 'ti_3', productId: 'prod_chilly_chicken_dry', productName: 'Chicken Chilly Dry', size: 'Standard', quantity: 1, status: 'PREPARING', stationId: 'st_1', modifiers: [] },
            { id: 'ti_4', productId: 'prod_combo_signature', productName: 'Signature Combo (Medium Chicken Chowmein)', size: 'Standard', quantity: 1, status: 'PENDING', stationId: 'st_1', modifiers: ['Medium Chicken Chowmein'] }
          ],
          createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
          targetTime: new Date(Date.now() + 8 * 60000).toISOString(),
          priority: 'HIGH'
        }
      ];
      callback(mockTickets);
      return () => {};
    }

    try {
      const ticketsRef = collection(db, 'tickets');
      const q = query(
        ticketsRef, 
        where('status', 'in', ['NEW', 'ACCEPTED', 'PREPARING', 'READY'])
      );

      return onSnapshot(q, (snapshot) => {
        const tickets: Ticket[] = [];
        snapshot.forEach((doc) => {
          tickets.push({ id: doc.id, ...doc.data() } as Ticket);
        });
        callback(tickets);
      }, (error) => {
        onError(error);
      });
    } catch (e: any) {
      onError(e);
      return () => {};
    }
  }

  async updateTicketStatus(ticketId: string, status: OrderStatus): Promise<void> {
    if (!db) return;
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, { 
        status,
        ...(status === 'ACCEPTED' ? { acceptedAt: new Date().toISOString() } : {}),
        ...(status === 'READY' ? { completedAt: new Date().toISOString() } : {})
      });
    } catch (err) {
      console.warn("Could not update ticket in Firestore:", err);
    }
  }

  async updateItemStatus(ticketId: string, itemId: string, status: TicketItemStatus, items: TicketItem[]): Promise<void> {
    if (!db) return;
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      const updatedItems = items.map(item => 
        item.id === itemId 
          ? { ...item, status, ...(status === 'READY' ? { completedAt: new Date().toISOString() } : {}) }
          : item
      );
      
      const allReady = updatedItems.every(i => i.status === 'READY');
      
      await updateDoc(ticketRef, { 
        items: updatedItems,
        ...(allReady ? { status: 'READY', completedAt: new Date().toISOString() } : {})
      });
    } catch (err) {
      console.warn("Could not update ticket item in Firestore:", err);
    }
  }

  async createTicket(ticketData: Omit<Ticket, 'id' | 'createdAt'>): Promise<Ticket> {
    const newTicket: Ticket = {
      ...ticketData,
      id: `t_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    if (db) {
      try {
        await setDoc(doc(db, 'tickets', newTicket.id), JSON.parse(JSON.stringify(newTicket)));

      } catch (err) {
        console.warn("Could not save ticket to Firestore:", err);
      }
    }
    return newTicket;
  }
}

export const kdsService = new KdsService();
