import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ProductCard } from './ProductCard';
import { TrendingDown, Clock, ArrowLeft } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

interface DealsViewProps {
  onProductSelect: (product: Product) => void;
  onBack: () => void;
  onAddToCart?: (product: Product) => void;
}

export const DealsView = ({ onProductSelect, onBack, onAddToCart }: DealsViewProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .gt('stock', 0)
        .order('price', { ascending: true })
        .limit(50);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Marketplace
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TrendingDown className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Deals & Discounts</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {products.length} great deals available now
        </p>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Limited Time Offers</h2>
            <p className="text-orange-100">Save big on selected items. Don't miss out!</p>
          </div>
          <Clock className="w-16 h-16 opacity-50" />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
          <TrendingDown className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No deals available right now
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Check back soon for amazing offers!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative">
              {product.price < 50 && (
                <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  HOT DEAL
                </div>
              )}
              <ProductCard
                product={product}
                onViewDetails={onProductSelect}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
