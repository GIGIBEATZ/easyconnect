import { ArrowLeft, ArrowRight, RotateCw, Home, Lock, Star, Menu, Sparkles } from 'lucide-react';

interface BrowserToolbarProps {
  currentUrl: string;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
  onHome: () => void;
  onMenuClick: () => void;
}

export const BrowserToolbar = ({
  currentUrl,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onRefresh,
  onHome,
  onMenuClick,
}: BrowserToolbarProps) => {
  return (
    <div className="flex items-center h-12 px-3 gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center gap-1">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={onForward}
          disabled={!canGoForward}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Forward"
        >
          <ArrowRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={onRefresh}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Refresh"
        >
          <RotateCw className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={onHome}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Home"
        >
          <Home className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      <div className="flex-1 flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
        <Lock className="w-4 h-4 text-green-600 dark:text-green-400" />
        <input
          type="text"
          value={currentUrl}
          readOnly
          className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none"
        />
        <Star className="w-4 h-4 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
      </div>

      <div className="flex items-center gap-1">
        <button
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
          title="Brave Leo AI"
        >
          <Sparkles className="w-5 h-5 text-orange-500" />
        </button>
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Menu"
        >
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};
