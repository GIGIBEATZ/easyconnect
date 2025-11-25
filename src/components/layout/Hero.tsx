import { ShoppingBag, Briefcase, Users, TrendingUp } from 'lucide-react';

interface HeroProps {
  onViewChange: (view: string) => void;
}

export const Hero = ({ onViewChange }: HeroProps) => {
  const features = [
    {
      icon: ShoppingBag,
      title: 'Buy & Sell',
      description: 'Discover unique products from trusted sellers',
      action: 'marketplace',
      color: 'blue',
    },
    {
      icon: Briefcase,
      title: 'Find Jobs',
      description: 'Explore career opportunities that match your skills',
      action: 'jobs',
      color: 'green',
    },
    {
      icon: Users,
      title: 'Hire Talent',
      description: 'Connect with qualified candidates for your team',
      action: 'jobs',
      color: 'orange',
    },
    {
      icon: TrendingUp,
      title: 'Grow Business',
      description: 'Expand your reach and increase sales',
      action: 'marketplace',
      color: 'purple',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30',
      green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 group-hover:bg-green-100 dark:group-hover:bg-green-900/30',
      orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30',
      purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Your Complete
            <span className="text-blue-600 dark:text-blue-400"> Marketplace</span> &
            <span className="text-green-600 dark:text-green-400"> Career Hub</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            One platform connecting buyers, sellers, job seekers, and employers.
            Everything you need to grow your business and advance your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.title}
                onClick={() => onViewChange(feature.action)}
                className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 text-left border border-gray-100 dark:border-gray-700"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${getColorClasses(feature.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onViewChange('marketplace')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            Browse Products
          </button>
          <button
            onClick={() => onViewChange('jobs')}
            className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium shadow-sm"
          >
            Find Jobs
          </button>
        </div>
      </div>
    </div>
  );
};
