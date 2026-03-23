'use client';

import { create } from 'zustand';
import axios from 'axios';
import { urlconstant } from '@/app/constants';

interface Portfolio {
  id: number;
  nom: string;
  montant_invest: number;
  cash: number;
  user_id: number;
  [key: string]: any;
}

interface PortfolioState {
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchPortfolios: (userId: number | string) => Promise<void>;
  selectPortfolio: (portfolio: Portfolio | null) => void;
  createPortfolio: (data: Partial<Portfolio>) => Promise<Portfolio>;
  deletePortfolio: (id: number) => Promise<void>;
  clearPortfolios: () => void;
}

const usePortfolioStore = create<PortfolioState>()((set, get) => ({
  portfolios: [],
  selectedPortfolio: null,
  loading: false,
  error: null,

  fetchPortfolios: async (userId) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(
        `${urlconstant}/api/portefeuilles/user/${userId}`
      );
      set({ portfolios: response.data || [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  selectPortfolio: (portfolio) => set({ selectedPortfolio: portfolio }),

  createPortfolio: async (data) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post(
        `${urlconstant}/api/portefeuilles`,
        data
      );
      const newPortfolio = response.data;
      set((state) => ({
        portfolios: [...state.portfolios, newPortfolio],
      }));
      return newPortfolio;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deletePortfolio: async (id) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${urlconstant}/api/portefeuilles/${id}`);
      set((state) => ({
        portfolios: state.portfolios.filter((p) => p.id !== id),
        selectedPortfolio:
          state.selectedPortfolio?.id === id
            ? null
            : state.selectedPortfolio,
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearPortfolios: () =>
    set({ portfolios: [], selectedPortfolio: null, error: null }),
}));

export default usePortfolioStore;
