import { useBrowsingHistory } from '../../contexts/BrowsingHistoryContext';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Database } from '../../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

interface RecentlyViewedProps {
  onProductClick: (product: Product) => void;
}

export const RecentlyViewed = ({ onProductClick }: RecentlyViewedProps) => {
  const { recentlyViewedProducts, loading } = useBrowsingHistory();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  if (loading || recentlyViewedProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recently Viewed</h2>
        </div>
        <div className="flex gap-2">
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {recentlyViewedProducts.map((product) => (
          <button
            key={product.id}
            onClick={() => onProductClick(product)}
            className="flex-shrink-0 w-48 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div className="aspect-square bg-gray-200 dark:bg-gray-600">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Clock className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 mb-1">
                {product.title}
              </h3>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
