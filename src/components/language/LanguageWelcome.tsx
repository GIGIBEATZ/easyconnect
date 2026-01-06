import { useState, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const POPULAR_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
];

const OTHER_LANGUAGES: Language[] = [
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱' },
];

interface LanguageWelcomeProps {
  onLanguageSelect: () => void;
}

export const LanguageWelcome = ({ onLanguageSelect }: LanguageWelcomeProps) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const allLanguages = [...POPULAR_LANGUAGES, ...OTHER_LANGUAGES];

  const filteredLanguages = searchQuery
    ? allLanguages.filter(
        (lang) =>
          lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : showAllLanguages
    ? allLanguages
    : POPULAR_LANGUAGES;

  const handleLanguageSelect = async (code: string) => {
    setIsProcessing(true);
    setSelectedLanguage(code);
    await setLanguage(code);
    localStorage.setItem('hasSelectedLanguage', 'true');
    setTimeout(() => {
      onLanguageSelect();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 flex items-center justify-center p-4 relative">
      {isProcessing && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-900">Loading TechSupport Global...</p>
          </div>
        </div>
      )}
      <div className="max-w-5xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white bg-opacity-20 rounded-full mb-6">
            <Globe className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to TechSupport Global
          </h1>
          <p className="text-xl text-blue-100 mb-2">
            Expert Tech Support, Anytime, Anywhere
          </p>
          <p className="text-lg text-blue-100">
            Please select your language / Seleccione su idioma / Choisissez votre langue
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
            {filteredLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                disabled={isProcessing}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedLanguage === language.code
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{language.flag}</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{language.nativeName}</p>
                    <p className="text-sm text-gray-600">{language.name}</p>
                  </div>
                </div>
                {selectedLanguage === language.code && (
                  <Check className="w-6 h-6 text-blue-600" />
                )}
              </button>
            ))}
          </div>

          {!showAllLanguages && !searchQuery && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAllLanguages(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Show more languages ({OTHER_LANGUAGES.length} more)
              </button>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>We support {allLanguages.length}+ languages worldwide</p>
            <p className="mt-2">You can change the language anytime from settings</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white text-sm opacity-90">
            🌍 Serving customers in 150+ countries
          </p>
        </div>
      </div>
    </div>
  );
};
