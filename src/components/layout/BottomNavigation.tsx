import { Home, Headphones, Users, GraduationCap, Menu, Ticket, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
} & (
  | { view: string; action?: never }
  | { action: string; view?: never }
);

interface BottomNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onMenuToggle: () => void;
}

export const BottomNavigation = ({ currentView, onViewChange, onMenuToggle }: BottomNavigationProps) => {
  const { user } = useAuth();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home, view: 'home' },
    ...(user ? [
      { id: 'tickets', label: 'Tickets', icon: Ticket, view: 'tickets' },
      { id: 'messages', label: 'Chat', icon: MessageCircle, view: 'messages' },
    ] : [
      { id: 'services', label: 'Services', icon: Headphones, view: 'services' },
      { id: 'agents', label: 'Agents', icon: Users, view: 'find-agents' },
    ]) as NavItem[],
    { id: 'learning', label: 'Learn', icon: GraduationCap, view: 'learning' },
    { id: 'more', label: 'More', icon: Menu, action: 'menu' },
  ];

  const handleClick = (item: NavItem) => {
    if ('action' in item && item.action === 'menu') {
      onMenuToggle();
    } else if ('view' in item && item.view) {
      onViewChange(item.view);
    }
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = 'view' in item && item.view && currentView === item.view;
          const isMenuTrigger = 'action' in item;

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {isMenuTrigger && (
                  <span className="sr-only">Open menu</span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
