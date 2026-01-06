import { Monitor, Wifi, Shield, Cloud, Smartphone, Code, HardDrive, Headphones } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface HeroProps {
  onViewChange: (view: string) => void;
}

export const Hero = ({ onViewChange }: HeroProps) => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Monitor,
      titleKey: 'service.hardware',
      title: 'Hardware Support',
      description: 'Computer repair and troubleshooting',
      color: 'blue',
    },
    {
      icon: Code,
      titleKey: 'service.software',
      title: 'Software Support',
      description: 'Installation and configuration',
      color: 'green',
    },
    {
      icon: Wifi,
      titleKey: 'service.network',
      title: 'Network Solutions',
      description: 'Wi-Fi setup and optimization',
      color: 'orange',
    },
    {
      icon: Cloud,
      titleKey: 'service.cloud',
      title: 'Cloud Services',
      description: 'Cloud migration and management',
      color: 'cyan',
    },
    {
      icon: Shield,
      titleKey: 'service.security',
      title: 'Cybersecurity',
      description: 'Security audits and protection',
      color: 'red',
    },
    {
      icon: HardDrive,
      titleKey: 'service.data',
      title: 'Data Recovery',
      description: 'Backup and recovery services',
      color: 'yellow',
    },
    {
      icon: Smartphone,
      titleKey: 'service.mobile',
      title: 'Mobile Support',
      description: 'Smartphone and tablet help',
      color: 'pink',
    },
    {
      icon: Headphones,
      titleKey: '24/7 Support',
      title: '24/7 Support',
      description: 'Always here to help you',
      color: 'teal',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30',
      green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 group-hover:bg-green-100 dark:group-hover:bg-green-900/30',
      orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30',
      cyan: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/30',
      red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/30',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/30',
      pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/30',
      teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t('hero.title', 'Get Expert Tech Support')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            {t('hero.subtitle', '24/7 technical support in your language. Hardware, software, network solutions and more.')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <Shield className="w-5 h-5 mr-2" />
              <span className="font-medium">Secure & Trusted</span>
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-400">
              <Headphones className="w-5 h-5 mr-2" />
              <span className="font-medium">24/7 Available</span>
            </div>
            <div className="flex items-center text-orange-600 dark:text-orange-400">
              <Monitor className="w-5 h-5 mr-2" />
              <span className="font-medium">Expert Technicians</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.title}
                onClick={() => onViewChange('services')}
                className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 text-left border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-200 ${getColorClasses(service.color)}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {service.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => onViewChange('create-ticket')}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-lg hover:shadow-xl text-lg"
          >
            {t('hero.cta', 'Get Support Now')}
          </button>
          <button
            onClick={() => onViewChange('find-agents')}
            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-lg"
          >
            Find Expert Agents
          </button>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">50K+</div>
            <div className="text-gray-600 dark:text-gray-400">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">150+</div>
            <div className="text-gray-600 dark:text-gray-400">Countries</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-400">Support</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">55+</div>
            <div className="text-gray-600 dark:text-gray-400">Languages</div>
          </div>
        </div>
      </div>
    </div>
  );
};
