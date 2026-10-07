import { create } from 'zustand';
import { Ticket, Station, OrderStatus, TicketItemStatus } from '../models/kds';
import { kdsService } from '../services/kdsService';

interface KdsState {
  stations: Station[];
  tickets: Ticket[];
  activeStationId: string | null;
  loading: boolean;
  error: string | null;

  loadStations: () => Promise<void>;
  setActiveStation: (stationId: string | null) => void;
  subscribeToTickets: () => () => void;
  updateTicketStatus: (ticketId: string, status: OrderStatus) => Promise<void>;
  updateItemStatus: (ticketId: string, itemId: string, status: TicketItemStatus) => Promise<void>;
  _optimisticUpdateTicketStatus: (ticketId: string, status: OrderStatus) => void;
  _optimisticUpdateItemStatus: (ticketId: string, itemId: string, status: TicketItemStatus) => void;
}

export const useKdsStore = create<KdsState>((set, get) => ({
  stations: [],
  tickets: [],
  activeStationId: null,
  loading: false,
  error: null,

  loadStations: async () => {
    set({ loading: true });
    try {
      const stations = await kdsService.getStations();
      set({ stations, loading: false });
      if (stations.length > 0 && !get().activeStationId) {
        set({ activeStationId: stations[0].id });
      }
    } catch (error) {
      console.error('Failed to load stations', error);
      set({ loading: false });
    }
  },

  setActiveStation: (stationId) => {
    set({ activeStationId: stationId });
  },

  subscribeToTickets: () => {
    const unsubscribe = kdsService.subscribeToTickets(
      get().activeStationId,
      (tickets) => set({ tickets, error: null }),
      (error) => set({ tickets: [], error: error.message })
    );
    return unsubscribe;
  },

  updateTicketStatus: async (ticketId, status) => {
    try {
      await kdsService.updateTicketStatus(ticketId, status);
      set({ error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Could not update ticket.' });
    }
  },

  updateItemStatus: async (ticketId, itemId, status) => {
    const ticket = get().tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    try {
      await kdsService.updateItemStatus(ticketId, itemId, status, ticket.items);
      set({ error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Could not update item.' });
    }
  },

  _optimisticUpdateTicketStatus: (ticketId, status) => {
    set((state) => ({
      tickets: state.tickets.map((t) => 
        t.id === ticketId ? { ...t, status } : t
      )
    }));
  },

  _optimisticUpdateItemStatus: (ticketId, itemId, status) => {
    set((state) => ({
      tickets: state.tickets.map((t) => {
        if (t.id === ticketId) {
          const updatedItems = t.items.map(item => item.id === itemId ? { ...item, status } : item);
          const allReady = updatedItems.every(i => i.status === 'READY');
          return { 
            ...t, 
            items: updatedItems,
            status: allReady ? 'READY' : t.status
          };
        }
        return t;
      })
    }));
  }
}));
