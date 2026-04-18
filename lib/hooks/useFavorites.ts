import { useState, useCallback } from 'react';

const STORAGE_KEY = 'encasa_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const toggleFavorite = useCallback((storeId: string) => {
    setFavorites(prev => {
      const next = prev.includes(storeId)
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((storeId: string) => favorites.includes(storeId), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
