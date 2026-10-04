import { collection, query, where, onSnapshot, doc, updateDoc, getDocs, setDoc, deleteDoc, runTransaction } from 'firebase/firestore';
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
      onError(new Error('Kitchen storage is unavailable.'));
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
    if (!db) throw new Error('Kitchen storage is unavailable.');
    await runTransaction(db, async transaction => {
      const ref = doc(db, 'tickets', ticketId);
      const snapshot = await transaction.get(ref);
      if (!snapshot.exists()) throw new Error('Kitchen ticket no longer exists.');
      const ticket = snapshot.data() as Ticket;
      const transitions: Record<string, string[]> = {
        NEW: ['ACCEPTED', 'CANCELLED'], ACCEPTED: ['PREPARING', 'CANCELLED'],
        PREPARING: ['READY', 'CANCELLED'], READY: ['SERVED', 'CANCELLED']
      };
      if (ticket.status === status) return;
      if (!transitions[ticket.status]?.includes(status)) throw new Error('The ticket changed. Refresh and try again.');
      transaction.update(ref, {
        status,
        ...(status === 'ACCEPTED' ? { acceptedAt: new Date().toISOString() } : {}),
        ...(status === 'READY' ? { completedAt: new Date().toISOString(), items: ticket.items.map(item => ({ ...item, status: 'READY' })) } : {})
      });
    });
  }

  async updateItemStatus(ticketId: string, itemId: string, status: TicketItemStatus, _items: TicketItem[]): Promise<void> {
    if (!db) throw new Error('Kitchen storage is unavailable.');
    await runTransaction(db, async transaction => {
      const ref = doc(db, 'tickets', ticketId);
      const snapshot = await transaction.get(ref);
      if (!snapshot.exists()) throw new Error('Kitchen ticket no longer exists.');
      const ticket = snapshot.data() as Ticket;
      if (!['NEW', 'ACCEPTED', 'PREPARING', 'READY'].includes(ticket.status)) throw new Error('This ticket is already closed.');
      const items = ticket.items.map(item => item.id === itemId ? { ...item, status } : item);
      const allReady = items.every(item => item.status === 'READY');
      transaction.update(ref, { items, status: allReady ? 'READY' : 'PREPARING', completedAt: allReady ? new Date().toISOString() : null });
    });
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
