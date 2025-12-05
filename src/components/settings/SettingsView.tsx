import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Settings, Sun, Moon, Monitor, Bell, Mail, User, Globe, ChevronRight } from 'lucide-react';

interface SettingsViewProps {
  onNavigate?: (view: string) => void;
}

export const SettingsView = ({ onNavigate }: SettingsViewProps = {}) => {
  const { themeMode, setThemeMode, colorScheme, setColorScheme } = useTheme();
  const { profile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    notificationTypes: {
      orders: true,
      messages: true,
      applications: true,
      price_drops: true,
      new_listings: true,
    },
  });

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  const colorOptions = [
    { value: 'blue' as const, label: 'Blue', color: 'bg-blue-500' },
    { value: 'green' as const, label: 'Green', color: 'bg-green-500' },
    { value: 'purple' as const, label: 'Purple', color: 'bg-purple-500' },
    { value: 'orange' as const, label: 'Orange', color: 'bg-orange-500' },
    { value: 'red' as const, label: 'Red', color: 'bg-red-500' },
  ];

  const handleSaveNotificationPreferences = async () => {
    setSaving(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: profile?.id,
          email_notifications: preferences.emailNotifications,
          notification_types: preferences.notificationTypes,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setMessage('Preferences saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving preferences');
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and settings</p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200">{message}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account Information</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <p className="text-gray-900 dark:text-white">{profile?.full_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <p className="text-gray-900 dark:text-white">{profile?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Roles
              </label>
              <div className="flex flex-wrap gap-2">
                {profile?.roles.map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                  >
                    {role.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Theme Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setThemeMode(option.value)}
                      className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                        themeMode === option.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${
                        themeMode === option.value
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        themeMode === option.value
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Accent Color
              </label>
              <div className="grid grid-cols-5 gap-3">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setColorScheme(option.value)}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                      colorScheme === option.value
                        ? 'border-gray-900 dark:border-white'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${option.color} mb-2`} />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                </div>
              </div>
              <button
                onClick={() => setPreferences({
                  ...preferences,
                  emailNotifications: !preferences.emailNotifications
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.emailNotifications
                    ? 'bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Notification Types
              </p>
              <div className="space-y-3">
                {Object.entries(preferences.notificationTypes).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {key.replace('_', ' ')}
                    </span>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        notificationTypes: {
                          ...preferences.notificationTypes,
                          [key]: e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveNotificationPreferences}
              disabled={saving}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saving ? 'Saving...' : 'Save Notification Preferences'}
            </button>
          </div>
        </div>

        {onNavigate && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-2 border-dashed border-orange-300 dark:border-orange-800">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Browser Experience</h2>
                  <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded">
                    EXPERIMENTAL
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Enable immersive browsing with automatic tab bar hiding, custom backgrounds, and a distraction-free experience.
                </p>
                <button
                  onClick={() => onNavigate('browser-settings')}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
                >
                  Configure Browser Settings
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
