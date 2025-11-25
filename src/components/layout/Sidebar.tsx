import { useState } from 'react';
import {
  Home, ShoppingBag, Briefcase, Heart, ShoppingCart, Package,
  TrendingUp, MessageSquare, User, Settings, ChevronRight,
  ChevronDown, X, Menu
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import { LanguageSelector } from '../language/LanguageSelector';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  view: string;
  color: string;
  badge?: number;
  children?: SidebarItem[];
  requiresAuth?: boolean;
  requiresRole?: string;
}

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ currentView, onViewChange, isOpen, onClose }: SidebarProps) => {
  const { profile } = useAuth();
  const { totalItems } = useCart();
  const { favoriteProducts } = useFavorites();
  const { unreadCount } = useNotifications();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  const isSeller = profile?.roles.includes('seller');
  const isEmployer = profile?.roles.includes('employer');

  const menuItems: SidebarItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      view: 'home',
      color: 'bg-blue-500',
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: ShoppingBag,
      view: 'marketplace',
      color: 'bg-green-500',
      children: [
        { id: 'all-products', label: 'All Products', icon: ShoppingBag, view: 'marketplace', color: 'bg-green-500' },
        { id: 'categories', label: 'Categories', icon: ShoppingBag, view: 'categories', color: 'bg-green-500' },
        { id: 'deals', label: 'Deals & Discounts', icon: TrendingUp, view: 'deals', color: 'bg-green-500' },
      ],
    },
    {
      id: 'jobs',
      label: 'Jobs',
      icon: Briefcase,
      view: 'jobs',
      color: 'bg-purple-500',
      children: [
        { id: 'browse-jobs', label: 'Browse Jobs', icon: Briefcase, view: 'jobs', color: 'bg-purple-500' },
        { id: 'my-applications', label: 'My Applications', icon: Briefcase, view: 'my-applications', color: 'bg-purple-500', requiresAuth: true },
        { id: 'saved-jobs', label: 'Saved Jobs', icon: Heart, view: 'saved-jobs', color: 'bg-purple-500', requiresAuth: true },
        { id: 'post-job', label: 'Post a Job', icon: Briefcase, view: 'post-job', color: 'bg-purple-500', requiresAuth: true },
      ],
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      view: 'wishlist',
      color: 'bg-red-500',
      badge: favoriteProducts.length,
      requiresAuth: true,
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingCart,
      view: 'cart',
      color: 'bg-orange-500',
      badge: totalItems,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: Package,
      view: 'my-orders',
      color: 'bg-indigo-500',
      requiresAuth: true,
      children: [
        { id: 'active-orders', label: 'Active Orders', icon: Package, view: 'my-orders', color: 'bg-indigo-500' },
        { id: 'order-history', label: 'Order History', icon: Package, view: 'order-history', color: 'bg-indigo-500' },
      ],
    },
    {
      id: 'selling',
      label: 'Selling',
      icon: TrendingUp,
      view: 'seller-dashboard',
      color: 'bg-teal-500',
      requiresAuth: true,
      requiresRole: 'seller',
      children: [
        { id: 'seller-dashboard', label: 'Dashboard', icon: TrendingUp, view: 'seller-dashboard', color: 'bg-teal-500' },
        { id: 'my-products', label: 'My Products', icon: ShoppingBag, view: 'my-products', color: 'bg-teal-500' },
        { id: 'add-product', label: 'Add Product', icon: ShoppingBag, view: 'add-product', color: 'bg-teal-500' },
      ],
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      view: 'messages',
      color: 'bg-pink-500',
      badge: unreadCount,
      requiresAuth: true,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      view: 'profile',
      color: 'bg-gray-500',
      requiresAuth: true,
      children: [
        { id: 'my-profile', label: 'My Profile', icon: User, view: 'profile', color: 'bg-gray-500' },
        { id: 'browsing-history', label: 'Browsing History', icon: Home, view: 'browsing-history', color: 'bg-gray-500' },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      view: 'settings',
      color: 'bg-gray-600',
      requiresAuth: true,
    },
  ];

  const toggleMenu = (itemId: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedMenus(newExpanded);
  };

  const handleItemClick = (item: SidebarItem) => {
    if (item.children && item.children.length > 0) {
      toggleMenu(item.id);
    } else {
      onViewChange(item.view);
      if (window.innerWidth < 1024) {
        onClose();
      }
    }
  };

  const filteredMenuItems = menuItems.filter(item => {
    if (item.requiresAuth && !profile) return false;
    if (item.requiresRole === 'seller' && !isSeller) return false;
    if (item.requiresRole === 'employer' && !isEmployer) return false;
    return true;
  });

  const renderMenuItem = (item: SidebarItem, isChild = false) => {
    const isActive = currentView === item.view;
    const isExpanded = expandedMenus.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const Icon = item.icon;

    const filteredChildren = item.children?.filter(child => {
      if (child.requiresAuth && !profile) return false;
      return true;
    });

    return (
      <div key={item.id}>
        <button
          onClick={() => handleItemClick(item)}
          className={`w-full flex items-center justify-between px-4 py-3 transition-all ${
            isChild ? 'pl-12' : ''
          } ${
            isActive
              ? `${item.color} text-white`
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {!isChild && <Icon className="w-5 h-5" />}
            <span className="font-medium">{item.label}</span>
          </div>
          <div className="flex items-center gap-2">
            {item.badge !== undefined && item.badge > 0 && (
              <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                isActive ? 'bg-white text-gray-900' : 'bg-red-500 text-white'
              }`}>
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
            {hasChildren && (
              isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            )}
          </div>
        </button>

        {hasChildren && isExpanded && filteredChildren && (
          <div className="bg-gray-50 dark:bg-gray-900">
            {filteredChildren.map(child => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">MarketHub</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="py-2">
          {filteredMenuItems.map(item => renderMenuItem(item))}
        </nav>

        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <LanguageSelector variant="sidebar" />
        </div>

        {!profile && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                onViewChange('home');
                onClose();
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign In
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
