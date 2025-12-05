import { Settings } from 'lucide-react';

interface BrowserSettingsProps {
  hideTabBar: boolean;
  onToggleTabBar: (hide: boolean) => void;
}

export const BrowserSettings = ({ hideTabBar, onToggleTabBar }: BrowserSettingsProps) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance Settings</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customize your browsing experience</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  Hide tab bar (experimental)
                </h3>
                <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded">
                  BETA
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Automatically hide the tab bar for a distraction-free, immersive browsing experience.
                Move your cursor to the top of the window to reveal tabs.
              </p>
            </div>
            <button
              onClick={() => onToggleTabBar(!hideTabBar)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-4 ${
                hideTabBar
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
              role="switch"
              aria-checked={hideTabBar}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  hideTabBar ? 'translate-x-5' : 'translate-x-0.5'
                } mt-0.5`}
              />
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Tip:</strong> When tab bar hiding is enabled, hover near the top edge of your screen to quickly access your tabs.
              Perfect for enjoying full-screen content with your custom wallpaper.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
