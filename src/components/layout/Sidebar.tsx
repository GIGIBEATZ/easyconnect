import { useState } from 'react';
import {
  Home, Users, MessageSquare, User, Settings, ChevronRight,
  ChevronDown, X, Headphones, Zap, GraduationCap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
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
}

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ currentView, onViewChange, isOpen, onClose }: SidebarProps) => {
  const { profile } = useAuth();
  const { unreadCount } = useNotifications();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  const menuItems: SidebarItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      view: 'home',
      color: 'bg-blue-500',
    },
    {
      id: 'learning',
      label: 'Learning Hub',
      icon: GraduationCap,
      view: 'learning',
      color: 'bg-purple-500',
    },
    {
      id: 'services',
      label: 'Services',
      icon: Zap,
      view: 'services',
      color: 'bg-amber-500',
      children: [
        { id: 'all-services', label: 'Browse Services', icon: Zap, view: 'services', color: 'bg-amber-500' },
        { id: 'find-agents', label: 'Find Agents', icon: Users, view: 'find-agents', color: 'bg-cyan-500' },
      ],
    },
    {
      id: 'tickets',
      label: 'My Tickets',
      icon: Headphones,
      view: 'tickets',
      color: 'bg-green-500',
      badge: unreadCount,
      requiresAuth: true,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      view: 'messages',
      color: 'bg-pink-500',
      requiresAuth: true,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      view: 'profile',
      color: 'bg-gray-500',
      requiresAuth: true,
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
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">TechAssist</h1>
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
