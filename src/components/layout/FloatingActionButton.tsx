import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  label?: string;
}

export const FloatingActionButton = ({ onClick, label = 'Create Ticket' }: FloatingActionButtonProps) => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <button
      onClick={onClick}
      className={`lg:hidden fixed right-4 bottom-20 z-30 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 group ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
      }`}
      aria-label={label}
    >
      <span className="flex items-center justify-center w-14 h-14">
        <Plus className="w-6 h-6" />
      </span>
      <span className="pr-4 text-sm font-medium max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300">
        {label}
      </span>
    </button>
  );
};
