import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type Job = Database['public']['Tables']['jobs']['Row'];

interface BrowsingHistoryItem {
  id: string;
  user_id: string;
  entity_type: 'product' | 'job';
  entity_id: string;
  viewed_at: string;
}

interface BrowsingHistoryContextType {
  recentlyViewedProducts: Product[];
  recentlyViewedJobs: Job[];
  trackView: (entityType: 'product' | 'job', entityId: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  loading: boolean;
}

const BrowsingHistoryContext = createContext<BrowsingHistoryContextType | undefined>(undefined);

export const useBrowsingHistory = () => {
  const context = useContext(BrowsingHistoryContext);
  if (!context) {
    throw new Error('useBrowsingHistory must be used within BrowsingHistoryProvider');
  }
  return context;
};

interface BrowsingHistoryProviderProps {
  children: ReactNode;
}

export const BrowsingHistoryProvider = ({ children }: BrowsingHistoryProviderProps) => {
  const { user } = useAuth();
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<Product[]>([]);
  const [recentlyViewedJobs, setRecentlyViewedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBrowsingHistory();
    } else {
      setRecentlyViewedProducts([]);
      setRecentlyViewedJobs([]);
      setLoading(false);
    }
  }, [user]);

  const loadBrowsingHistory = async () => {
    if (!user) return;

    try {
      const { data: historyData, error } = await supabase
        .from('browsing_history')
        .select('*')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const productIds = historyData?.filter(h => h.entity_type === 'product').map(h => h.entity_id) || [];
      const jobIds = historyData?.filter(h => h.entity_type === 'job').map(h => h.entity_id) || [];

      if (productIds.length > 0) {
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);

        const orderedProducts = productIds
          .map(id => products?.find(p => p.id === id))
          .filter((p): p is Product => p !== undefined)
          .slice(0, 10);

        setRecentlyViewedProducts(orderedProducts);
      }

      if (jobIds.length > 0) {
        const { data: jobs } = await supabase
          .from('jobs')
          .select('*')
          .in('id', jobIds);

        const orderedJobs = jobIds
          .map(id => jobs?.find(j => j.id === id))
          .filter((j): j is Job => j !== undefined)
          .slice(0, 10);

        setRecentlyViewedJobs(orderedJobs);
      }
    } catch (error) {
      console.error('Error loading browsing history:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackView = async (entityType: 'product' | 'job', entityId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('browsing_history')
        .insert({
          user_id: user.id,
          entity_type: entityType,
          entity_id: entityId,
        });

      await loadBrowsingHistory();
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const clearHistory = async () => {
    if (!user) return;

    try {
      await supabase
        .from('browsing_history')
        .delete()
        .eq('user_id', user.id);

      setRecentlyViewedProducts([]);
      setRecentlyViewedJobs([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  return (
    <BrowsingHistoryContext.Provider
      value={{
        recentlyViewedProducts,
        recentlyViewedJobs,
        trackView,
        clearHistory,
        loading,
      }}
    >
      {children}
    </BrowsingHistoryContext.Provider>
  );
};
