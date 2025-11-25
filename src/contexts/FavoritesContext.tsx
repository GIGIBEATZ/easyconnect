import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

interface FavoritesContextType {
  favorites: Favorite[];
  favoriteProducts: Product[];
  isFavorite: (productId: string) => boolean;
  addFavorite: (productId: string) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  clearFavorites: () => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
      setFavoriteProducts([]);
      setLoading(false);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      const { data: favoritesData, error: favError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (favError) throw favError;

      setFavorites(favoritesData || []);

      if (favoritesData && favoritesData.length > 0) {
        const productIds = favoritesData.map(f => f.product_id);
        const { data: productsData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);

        if (prodError) throw prodError;
        setFavoriteProducts(productsData || []);
      } else {
        setFavoriteProducts([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (productId: string): boolean => {
    return favorites.some(fav => fav.product_id === productId);
  };

  const addFavorite = async (productId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          product_id: productId,
        })
        .select()
        .single();

      if (error) throw error;

      setFavorites(prev => [data, ...prev]);

      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (productData) {
        setFavoriteProducts(prev => [productData, ...prev]);
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      setFavorites(prev => prev.filter(fav => fav.product_id !== productId));
      setFavoriteProducts(prev => prev.filter(prod => prod.id !== productId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  };

  const clearFavorites = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setFavorites([]);
      setFavoriteProducts([]);
    } catch (error) {
      console.error('Error clearing favorites:', error);
      throw error;
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteProducts,
        isFavorite,
        addFavorite,
        removeFavorite,
        clearFavorites,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
