import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';

const memory = new Map<string, string>();
const fallbackStorage: StateStorage = {
  getItem: (name) => memory.get(name) ?? null,
  setItem: (name, value) => { memory.set(name, value); },
  removeItem: (name) => { memory.delete(name); },
};

function getAppStorage(): StateStorage {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch {
    // Storage can be unavailable in restricted browser contexts or server-side tests.
  }
  return fallbackStorage;
}

interface AppState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  branchId: string | null;
  setBranchId: (id: string | null) => void;
  isOfflineMode: boolean;
  setOfflineMode: (offline: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      branchId: null,
      setBranchId: (branchId) => set({ branchId }),
      isOfflineMode: typeof navigator !== 'undefined' ? !navigator.onLine : false,
      setOfflineMode: (isOfflineMode) => set({ isOfflineMode }),
    }),
    {
      name: 'talkos-app-storage',
      storage: createJSONStorage(() => getAppStorage()),
    }
  )
);
