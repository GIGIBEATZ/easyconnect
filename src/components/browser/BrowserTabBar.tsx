import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tab {
  id: string;
  title: string;
  favicon?: string;
  active: boolean;
}

interface BrowserTabBarProps {
  tabs: Tab[];
  onTabClose: (id: string) => void;
  onTabSelect: (id: string) => void;
  onNewTab: () => void;
}

export const BrowserTabBar = ({ tabs, onTabClose, onTabSelect, onNewTab }: BrowserTabBarProps) => {
  return (
    <div className="flex items-center h-10 px-2 space-x-1 bg-gray-100/95 dark:bg-gray-900/95 backdrop-blur-xl">
      <div className="flex-1 flex items-center space-x-1 overflow-x-auto">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabSelect(tab.id)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-lg min-w-[120px] max-w-[200px] transition-colors ${
              tab.active
                ? 'bg-white dark:bg-gray-800 shadow-sm'
                : 'bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/70'
            }`}
          >
            {tab.favicon ? (
              <img src={tab.favicon} alt="" className="w-4 h-4 flex-shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0" />
            )}
            <span className="flex-1 text-sm truncate text-gray-700 dark:text-gray-300">
              {tab.title}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-all"
            >
              <X className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            </button>
          </motion.button>
        ))}
      </div>

      <button
        onClick={onNewTab}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="New Tab"
      >
        <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>
    </div>
  );
};
