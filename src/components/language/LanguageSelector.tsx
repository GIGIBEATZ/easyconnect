import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe, Check, Search, X } from 'lucide-react';
import { POPULAR_LANGUAGES } from '../../lib/i18n/languages';

interface LanguageSelectorProps {
  variant?: 'header' | 'sidebar' | 'settings';
}

export const LanguageSelector = ({ variant = 'header' }: LanguageSelectorProps) => {
  const { language, languages, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === language);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.native_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularLangs = filteredLanguages.filter(lang => POPULAR_LANGUAGES.includes(lang.code));
  const otherLangs = filteredLanguages.filter(lang => !POPULAR_LANGUAGES.includes(lang.code));

  const handleLanguageSelect = async (code: string) => {
    await changeLanguage(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  if (variant === 'settings') {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Language
        </label>
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.flag_emoji} {lang.native_name} ({lang.name})
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          variant === 'header'
            ? 'hover:bg-gray-100 dark:hover:bg-gray-800'
            : 'w-full hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        {variant === 'header' && currentLanguage && (
          <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentLanguage.flag_emoji} {currentLanguage.code.toUpperCase()}
          </span>
        )}
        {variant === 'sidebar' && currentLanguage && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentLanguage.flag_emoji} {currentLanguage.native_name}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`absolute ${variant === 'header' ? 'right-0' : 'left-0'} mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden flex flex-col`}>
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search languages..."
                className="w-full pl-9 pr-9 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto">
            {popularLangs.length > 0 && !searchQuery && (
              <div>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900">
                  Popular
                </div>
                {popularLangs.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="flex items-center gap-3 text-sm">
                      <span className="text-2xl">{lang.flag_emoji}</span>
                      <span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {lang.native_name}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          {lang.name}
                        </span>
                      </span>
                    </span>
                    {language === lang.code && (
                      <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {otherLangs.length > 0 && (
              <div>
                {!searchQuery && (
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900">
                    All Languages
                  </div>
                )}
                {otherLangs.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="flex items-center gap-3 text-sm">
                      <span className="text-2xl">{lang.flag_emoji}</span>
                      <span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {lang.native_name}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          {lang.name}
                        </span>
                        {lang.is_rtl && (
                          <span className="ml-2 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded">
                            RTL
                          </span>
                        )}
                      </span>
                    </span>
                    {language === lang.code && (
                      <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {filteredLanguages.length === 0 && (
              <div className="px-3 py-8 text-center text-gray-500 dark:text-gray-400">
                No languages found
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {languages.length} languages available
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
