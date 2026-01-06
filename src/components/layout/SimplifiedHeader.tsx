import { useAuth } from '../../contexts/AuthContext';
import { Search, User, LogOut, Settings, Menu } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '../theme/ThemeToggle';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { LanguageSelector } from '../language/LanguageSelector';

interface SimplifiedHeaderProps {
  onViewChange: (view: string) => void;
  onMenuToggle: () => void;
}

export const SimplifiedHeader = ({ onViewChange, onMenuToggle }: SimplifiedHeaderProps) => {
  const { profile, signOut } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onViewChange('services');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-30 transition-colors border-b border-gray-200 dark:border-gray-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search support services..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector variant="header" />

            <ThemeToggle />

            <NotificationDropdown onViewAll={() => onViewChange('notifications')} />

            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {profile.full_name || 'User'}
                  </span>
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {profile.full_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {profile.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onViewChange('profile');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </button>


                    <button
                      onClick={() => {
                        onViewChange('settings');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </button>

                    <hr className="my-2 border-gray-200 dark:border-gray-700" />

                    <button
                      onClick={() => {
                        signOut();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onViewChange('create-ticket')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </form>
      </div>
    </header>
  );
};
