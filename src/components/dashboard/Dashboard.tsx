import { useAuth } from '../../contexts/AuthContext';
import { Package, Briefcase, ShoppingBag, MessageSquare, TrendingUp } from 'lucide-react';

interface DashboardProps {
  onViewChange: (view: string) => void;
}

export const Dashboard = ({ onViewChange }: DashboardProps) => {
  const { profile } = useAuth();

  const getRoleCards = () => {
    const cards = [];

    if (profile?.roles.includes('seller')) {
      cards.push({
        title: 'My Products',
        description: 'Manage your product listings',
        icon: Package,
        color: 'blue',
        action: 'my-products',
        stats: 'View and edit your products',
      });
    }

    if (profile?.roles.includes('buyer')) {
      cards.push({
        title: 'My Orders',
        description: 'Track your purchases',
        icon: ShoppingBag,
        color: 'green',
        action: 'my-orders',
        stats: 'View order history',
      });
    }

    if (profile?.roles.includes('employer')) {
      cards.push({
        title: 'My Job Posts',
        description: 'Manage job listings',
        icon: Briefcase,
        color: 'orange',
        action: 'my-jobs',
        stats: 'View and edit job posts',
      });
    }

    if (profile?.roles.includes('job_seeker')) {
      cards.push({
        title: 'My Applications',
        description: 'Track job applications',
        icon: TrendingUp,
        color: 'purple',
        action: 'my-applications',
        stats: 'View application status',
      });
    }

    cards.push({
      title: 'Messages',
      description: 'Your conversations',
      icon: MessageSquare,
      color: 'gray',
      action: 'messages',
      stats: 'View all messages',
    });

    return cards;
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      orange: 'bg-orange-50 text-orange-600',
      purple: 'bg-purple-50 text-purple-600',
      gray: 'bg-gray-50 text-gray-600',
    };
    return colors[color] || colors.gray;
  };

  const roleCards = getRoleCards();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {profile?.full_name}!
        </h1>
        <p className="text-gray-600">Manage your activities across the platform</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Roles</h2>
        <div className="flex flex-wrap gap-2">
          {profile?.roles.map((role) => (
            <span
              key={role}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium text-sm"
            >
              {role.replace('_', ' ').charAt(0).toUpperCase() + role.replace('_', ' ').slice(1)}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roleCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.action}
              onClick={() => onViewChange(card.action)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 text-left border border-gray-100"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${getColorClasses(card.color)}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {card.description}
              </p>
              <p className="text-sm text-gray-500">
                {card.stats}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile?.roles.includes('seller') && (
            <button
              onClick={() => onViewChange('marketplace')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-left"
            >
              Add New Product
            </button>
          )}
          {profile?.roles.includes('employer') && (
            <button
              onClick={() => onViewChange('jobs')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-left"
            >
              Post New Job
            </button>
          )}
          <button
            onClick={() => onViewChange('marketplace')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-left"
          >
            Browse Marketplace
          </button>
          <button
            onClick={() => onViewChange('jobs')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-left"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    </div>
  );
};
