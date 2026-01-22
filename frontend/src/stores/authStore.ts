import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db, clearAllData } from '@/db';

interface User {
  id: string;
  phone: string;
  name: string;
  language: 'ar' | 'fr';
  isPremium: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: async (token: string, user: User) => {
        // Save to Dexie as well
        await db.user.clear();
        await db.user.add({
          ...user,
          token,
        });

        set({
          token,
          user,
          isAuthenticated: true,
        });
      },

      logout: async () => {
        // Clear all local data
        await clearAllData();
        localStorage.removeItem('rassidi-last-sync');

        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },
    }),
    {
      name: 'rassidi-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
