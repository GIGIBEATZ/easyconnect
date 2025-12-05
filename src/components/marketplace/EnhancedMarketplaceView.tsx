import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ProductCard } from './ProductCard';
import { SearchBar } from '../search/SearchBar';
import { SearchFilters, ProductFilters } from '../search/SearchFilters';
import { SortDropdown, ProductSortOption } from '../search/SortDropdown';
import { Plus, SlidersHorizontal, X } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

interface EnhancedMarketplaceViewProps {
  onProductSelect: (product: Product) => void;
  onAddProduct: () => void;
  onAddToCart?: (product: Product) => void;
}

export const EnhancedMarketplaceView = ({ onProductSelect, onAddProduct, onAddToCart }: EnhancedMarketplaceViewProps) => {
  const { profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState<ProductSortOption>('featured');

  const [filters, setFilters] = useState<ProductFilters>({
    minPrice: 0,
    maxPrice: 10000,
    categories: [],
    minRating: 0,
    inStockOnly: false,
    condition: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadProducts(), loadCategories()]);
    setLoading(false);
  };

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('type', 'product')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearch = () => {
    loadData();
  };

  const filteredAndSortedProducts = () => {
    let result = products.filter(product => {
      const matchesSearch = searchQuery === '' ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;

      const matchesCategory = filters.categories.length === 0 ||
        (product.category_id && filters.categories.includes(product.category_id));

      const matchesStock = !filters.inStockOnly || product.stock > 0;

      return matchesSearch && matchesPrice && matchesCategory && matchesStock;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'featured':
        default:
          return 0;
      }
    });

    return result;
  };

  const displayedProducts = filteredAndSortedProducts();
  const isSeller = profile?.roles.includes('seller');

  const activeFilterCount =
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 10000 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

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
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {displayedProducts.length} {displayedProducts.length === 1 ? 'product' : 'products'} found
            </p>
          </div>
          {isSeller && (
            <button
              onClick={onAddProduct}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              List Product
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search products..."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 lg:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <SortDropdown type="product" value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.categories.length > 0 && (
              <button
                onClick={() => setFilters({ ...filters, categories: [] })}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm"
              >
                <span>{filters.categories.length} {filters.categories.length === 1 ? 'category' : 'categories'}</span>
                <X className="w-3 h-3" />
              </button>
            )}
            {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
              <button
                onClick={() => setFilters({ ...filters, minPrice: 0, maxPrice: 10000 })}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm"
              >
                <span>${filters.minPrice} - ${filters.maxPrice}</span>
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.inStockOnly && (
              <button
                onClick={() => setFilters({ ...filters, inStockOnly: false })}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm"
              >
                <span>In Stock Only</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {(showFilters || window.innerWidth >= 1024) && (
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <SearchFilters
                type="product"
                filters={filters}
                onFilterChange={setFilters}
                categories={categories.map(c => ({ id: c.id, name: c.name }))}
              />
            </div>
          </aside>
        )}

        <div className="flex-1">
          {displayedProducts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={onProductSelect}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
