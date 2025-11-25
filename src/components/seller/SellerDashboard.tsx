import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import {
  TrendingUp, Package, DollarSign, ShoppingBag, Star,
  ArrowUp, ArrowDown, Eye, Plus
} from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  activeListings: number;
  pendingOrders: number;
  totalOrders: number;
  averageRating: number;
}

interface SellerDashboardProps {
  onViewChange: (view: string) => void;
}

export const SellerDashboard = ({ onViewChange }: SellerDashboardProps) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    activeListings: 0,
    pendingOrders: 0,
    totalOrders: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardStats();
    }
  }, [user]);

  const loadDashboardStats = async () => {
    if (!user) return;

    try {
      const [productsResult, ordersResult] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('seller_id', user.id)
          .eq('status', 'active'),
        supabase
          .from('orders')
          .select('*')
          .eq('seller_id', user.id),
      ]);

      const products = productsResult.data || [];
      const orders = ordersResult.data || [];

      const totalRevenue = orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, order) => sum + order.total_amount, 0);

      const pendingOrders = orders.filter(o =>
        ['pending', 'confirmed', 'shipped'].includes(o.status)
      ).length;

      setStats({
        totalRevenue,
        activeListings: products.length,
        pendingOrders,
        totalOrders: orders.length,
        averageRating: 4.5,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
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

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12.5%',
      isPositive: true,
    },
    {
      title: 'Active Listings',
      value: stats.activeListings.toString(),
      icon: ShoppingBag,
      color: 'bg-blue-500',
      change: '+3',
      isPositive: true,
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders.toString(),
      icon: Package,
      color: 'bg-orange-500',
      action: () => onViewChange('my-orders'),
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'bg-yellow-500',
      change: '+0.2',
      isPositive: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              Seller Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your sales and manage your store
            </p>
          </div>
          <button
            onClick={() => onViewChange('add-product')}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={card.action}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${
                card.action ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {card.change && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    card.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {card.isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    {card.change}
                  </div>
                )}
              </div>
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => onViewChange('my-products')}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium text-left flex items-center justify-between"
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                Manage Products
              </span>
              <span className="text-sm text-gray-500">{stats.activeListings} items</span>
            </button>
            <button
              onClick={() => onViewChange('my-orders')}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium text-left flex items-center justify-between"
            >
              <span className="flex items-center gap-3">
                <Package className="w-5 h-5" />
                View Orders
              </span>
              {stats.pendingOrders > 0 && (
                <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                  {stats.pendingOrders} pending
                </span>
              )}
            </button>
            <button
              onClick={() => onViewChange('add-product')}
              className="w-full px-4 py-3 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors font-medium text-left flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              List New Product
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Order completed - $85.00</span>
              <span className="text-gray-500 text-xs ml-auto">2h ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">New order received</span>
              <span className="text-gray-500 text-xs ml-auto">5h ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Product view increased</span>
              <span className="text-gray-500 text-xs ml-auto">1d ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Grow Your Business</h3>
            <p className="text-teal-100">Optimize your listings and reach more customers</p>
          </div>
          <Eye className="w-16 h-16 opacity-50" />
        </div>
      </div>
    </div>
  );
};
