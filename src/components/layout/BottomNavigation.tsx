import { Home, Headphones, Users, MessageSquare, Menu } from 'lucide-react';

interface BottomNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onMenuToggle: () => void;
}

export const BottomNavigation = ({ currentView, onViewChange, onMenuToggle }: BottomNavigationProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, view: 'home' },
    { id: 'services', label: 'Services', icon: Headphones, view: 'services' },
    { id: 'agents', label: 'Agents', icon: Users, view: 'find-agents' },
    { id: 'tickets', label: 'Tickets', icon: MessageSquare, view: 'tickets' },
    { id: 'more', label: 'More', icon: Menu, action: 'menu' },
  ];

  const handleClick = (item: typeof navItems[0]) => {
    if (item.action === 'menu') {
      onMenuToggle();
    } else if (item.view) {
      onViewChange(item.view);
    }
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
