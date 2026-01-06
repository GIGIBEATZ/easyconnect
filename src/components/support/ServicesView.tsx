import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Monitor, Wifi, Shield, Smartphone, Code, Search, Filter } from 'lucide-react';
import type { Database } from '../../lib/database.types';
import { useLanguage } from '../../contexts/LanguageContext';

type SupportService = Database['public']['Tables']['support_services']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

interface ServicesViewProps {
  onServiceSelect: (service: SupportService) => void;
}

export const ServicesView = ({ onServiceSelect }: ServicesViewProps) => {
  const { t, language } = useLanguage();
  const [services, setServices] = useState<SupportService[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadServices(), loadCategories()]);
    setLoading(false);
  };

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('support_services')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
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

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || service.category_id === selectedCategory;
    const matchesLanguage =
      service.languages_supported.includes(currentLanguage);

    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType.toLowerCase()) {
      case 'remote':
        return Monitor;
      case 'video':
        return Wifi;
      case 'phone':
        return Smartphone;
      case 'onsite':
        return Shield;
      default:
        return Code;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('nav.services', 'Support Services')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose from our expert technical support services
          </p>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          <Filter className="text-gray-400 w-5 h-5 flex-shrink-0" />
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All Services
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No services match your search
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const Icon = getServiceIcon(service.service_type);
            return (
              <div
                key={service.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer"
                onClick={() => onServiceSelect(service)}
              >
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Icon className="w-20 h-20 text-white opacity-90" />
                  <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium text-gray-900 dark:text-white">
                    {service.service_type}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        ${service.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {service.duration_minutes} min
                    </div>
                  </div>

                  {service.features && Array.isArray(service.features) && (
                    <div className="mb-4">
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {(service.features as string[]).slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap mb-4">
                    {service.languages_supported.slice(0, 5).map((lang) => (
                      <span
                        key={lang}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        {lang.toUpperCase()}
                      </span>
                    ))}
                    {service.languages_supported.length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                        +{service.languages_supported.length - 5}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onServiceSelect(service);
                    }}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Book Service
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
