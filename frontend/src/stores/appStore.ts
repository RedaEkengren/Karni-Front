import { create } from 'zustand';

type SyncStatus = 'idle' | 'syncing' | 'error' | 'success';

interface AppState {
  isOnline: boolean;
  syncStatus: SyncStatus;
  pendingChanges: number;
  lastSyncTime: string | null;

  // Actions
  setOnline: (online: boolean) => void;
  setSyncStatus: (status: SyncStatus) => void;
  setPendingChanges: (count: number) => void;
  setLastSyncTime: (time: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  syncStatus: 'idle',
  pendingChanges: 0,
  lastSyncTime: null,

  setOnline: (online) => set({ isOnline: online }),
  setSyncStatus: (status) => set({ syncStatus: status }),
  setPendingChanges: (count) => set({ pendingChanges: count }),
  setLastSyncTime: (time) => set({ lastSyncTime: time }),
}));

// Setup online/offline listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useAppStore.getState().setOnline(true);
  });

  window.addEventListener('offline', () => {
    useAppStore.getState().setOnline(false);
  });
}
