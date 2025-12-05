import { useState, useRef, ReactNode } from 'react';
import { Minimize2, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserTabBar } from './BrowserTabBar';
import { BrowserToolbar } from './BrowserToolbar';

interface Tab {
  id: string;
  title: string;
  favicon?: string;
  active: boolean;
}

interface BrowserWindowProps {
  children: ReactNode;
  hideTabBar?: boolean;
  customBackground?: string;
}

export const BrowserWindow = ({ children, hideTabBar = true, customBackground }: BrowserWindowProps) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(!hideTabBar);
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'Marketplace', active: true },
    { id: '2', title: 'My Dashboard', active: false },
    { id: '3', title: 'Settings', active: false },
  ]);
  const [isMaximized, setIsMaximized] = useState(true);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hideTabBar && e.clientY <= 10) {
      setIsTabBarVisible(true);
    } else if (hideTabBar && e.clientY > 60 && isTabBarVisible) {
      setIsTabBarVisible(false);
    }
  };

  const handleTabClose = (id: string) => {
    setTabs(tabs.filter((tab) => tab.id !== id));
  };

  const handleTabSelect = (id: string) => {
    setTabs(tabs.map((tab) => ({ ...tab, active: tab.id === id })));
  };

  const handleNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'New Tab',
      active: false,
    };
    setTabs([...tabs, newTab]);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{
        backgroundImage: customBackground
          ? `url(${customBackground})`
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{
          backdropFilter: 'blur(8px)',
        }}
      />

      <div className="relative h-full flex flex-col">
        <div className="relative z-50">
          <AnimatePresence>
            {isTabBarVisible && (
              <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="bg-gray-100/95 dark:bg-gray-900/95 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between h-8 px-2 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex-1" />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMaximized(!isMaximized)}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Minimize"
                    >
                      <Minimize2 className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => setIsMaximized(!isMaximized)}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Maximize"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => window.history.back()}
                      className="p-1.5 hover:bg-red-500 hover:text-white rounded transition-colors"
                      title="Close"
                    >
                      <X className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 hover:text-white" />
                    </button>
                  </div>
                </div>

                <BrowserTabBar
                  tabs={tabs}
                  onTabClose={handleTabClose}
                  onTabSelect={handleTabSelect}
                  onNewTab={handleNewTab}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={toolbarRef}>
            <BrowserToolbar
              currentUrl="marketplace.local/home"
              canGoBack={true}
              canGoForward={false}
              onBack={() => {}}
              onForward={() => {}}
              onRefresh={() => window.location.reload()}
              onHome={() => {}}
              onMenuClick={() => {}}
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-white/90 dark:bg-gray-900/90">
          {children}
        </div>
      </div>
    </div>
  );
};
