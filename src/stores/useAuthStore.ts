'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number | string;
  email?: string;
  nom?: string;
  prenom?: string;
  denomination?: string;
  pays?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  getToken: () => string | null;
  getUserId: () => number | string | null;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        // Also keep legacy localStorage keys for backward compatibility
        if (typeof window !== 'undefined') {
          localStorage.setItem('tokenEnCours', token);
          localStorage.setItem('userId', String(user.id));
        }
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('tokenEnCours');
          localStorage.removeItem('userId');
          localStorage.removeItem('authToken');
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (data) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...data } });
        }
      },

      getToken: () => get().token,
      getUserId: () => get().user?.id ?? null,
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
