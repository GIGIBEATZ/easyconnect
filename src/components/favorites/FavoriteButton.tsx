import { Heart } from 'lucide-react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useState } from 'react';

interface FavoriteButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  showToast?: boolean;
}

export const FavoriteButton = ({ productId, size = 'md', showToast = true }: FavoriteButtonProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const favorite = isFavorite(productId);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (favorite) {
        await removeFavorite(productId);
        if (showToast) {
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 2000);
        }
      } else {
        await addFavorite(productId);
        if (showToast) {
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 2000);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`${buttonSizeClasses[size]} bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-700`}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          className={`${sizeClasses[size]} transition-colors ${
            favorite
              ? 'fill-red-500 text-red-500'
              : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
          }`}
        />
      </button>

      {showMessage && (
        <div className="absolute top-full mt-2 right-0 bg-gray-900 dark:bg-gray-700 text-white text-xs py-1 px-3 rounded shadow-lg whitespace-nowrap z-10 animate-fade-in">
          {favorite ? 'Added to Wishlist' : 'Removed from Wishlist'}
        </div>
      )}
    </div>
  );
};
