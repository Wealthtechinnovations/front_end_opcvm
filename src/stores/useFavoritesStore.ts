'use client';

import { create } from 'zustand';
import axios from 'axios';
import { urlconstant } from '@/app/constants';

interface FavoritesState {
  favorites: number[];
  loading: boolean;

  // Actions
  fetchFavorites: (userId: number | string) => Promise<void>;
  addFavorite: (userId: number | string, fundId: number) => Promise<void>;
  removeFavorite: (userId: number | string, fundId: number) => Promise<void>;
  isFavorite: (fundId: number) => boolean;
  clearFavorites: () => void;
}

const useFavoritesStore = create<FavoritesState>()((set, get) => ({
  favorites: [],
  loading: false,

  fetchFavorites: async (userId) => {
    try {
      set({ loading: true });
      const response = await axios.get(`${urlconstant}/api/favoris/${userId}`);
      const fundIds = (response.data || []).map((f: any) => f.fund_id || f.id);
      set({ favorites: fundIds });
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      set({ loading: false });
    }
  },

  addFavorite: async (userId, fundId) => {
    try {
      await axios.post(`${urlconstant}/api/favoris`, {
        user_id: userId,
        fund_id: fundId,
      });
      set((state) => ({ favorites: [...state.favorites, fundId] }));
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  removeFavorite: async (userId, fundId) => {
    try {
      await axios.delete(`${urlconstant}/api/favoris/${userId}/${fundId}`);
      set((state) => ({
        favorites: state.favorites.filter((id) => id !== fundId),
      }));
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },

  isFavorite: (fundId) => get().favorites.includes(fundId),

  clearFavorites: () => set({ favorites: [] }),
}));

export default useFavoritesStore;
