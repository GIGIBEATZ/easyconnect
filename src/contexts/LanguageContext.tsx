import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Language, LanguageContextType, TranslationMap } from '../types/i18n.types';
import {
  loadTranslations,
  translate,
  getStoredLanguage,
  setStoredLanguage,
} from '../lib/i18n/translations';
import { DEFAULT_LANGUAGE, FALLBACK_LANGUAGE, isRTL } from '../lib/i18n/languages';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { user } = useAuth();
  const [language, setLanguage] = useState<string>(DEFAULT_LANGUAGE);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [translations, setTranslations] = useState<TranslationMap>({});
  const [fallbackTranslations, setFallbackTranslations] = useState<TranslationMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeLanguage();
    loadAvailableLanguages();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserLanguagePreference();
    }
  }, [user]);

  useEffect(() => {
    loadLanguageTranslations(language);
    updateHTMLAttributes(language);
  }, [language]);

  const initializeLanguage = async () => {
    const stored = getStoredLanguage();
    const browserLang = navigator.language.split('-')[0];
    const detectedLang = stored || browserLang || DEFAULT_LANGUAGE;

    setLanguage(detectedLang);
    await loadLanguageTranslations(FALLBACK_LANGUAGE);
    setLoading(false);
  };

  const loadAvailableLanguages = async () => {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.warn('Languages table not populated, using defaults');
        return;
      }
      if (data && data.length > 0) {
        setLanguages(data);
      }
    } catch (error) {
      console.warn('Error loading languages, using defaults:', error);
    }
  };

  const loadUserLanguagePreference = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_language_preferences')
        .select('language_code')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.warn('User language preferences not set:', error);
        return;
      }
      if (data?.language_code) {
        setLanguage(data.language_code);
        setStoredLanguage(data.language_code);
      }
    } catch (error) {
      console.warn('Error loading user language preference:', error);
    }
  };

  const loadLanguageTranslations = async (languageCode: string) => {
    const newTranslations = await loadTranslations(languageCode);

    if (languageCode === FALLBACK_LANGUAGE) {
      setFallbackTranslations(newTranslations);
    } else {
      setTranslations(newTranslations);
      if (Object.keys(fallbackTranslations).length === 0) {
        const fallback = await loadTranslations(FALLBACK_LANGUAGE);
        setFallbackTranslations(fallback);
      }
    }
  };

  const updateHTMLAttributes = (languageCode: string) => {
    const direction = isRTL(languageCode) ? 'rtl' : 'ltr';
    document.documentElement.lang = languageCode;
    document.documentElement.dir = direction;
  };

  const changeLanguage = async (languageCode: string) => {
    setLanguage(languageCode);
    setStoredLanguage(languageCode);

    if (user) {
      try {
        await supabase
          .from('user_language_preferences')
          .upsert({
            user_id: user.id,
            language_code: languageCode,
            updated_at: new Date().toISOString(),
          });
      } catch (error) {
        console.error('Error saving language preference:', error);
      }
    }
  };

  const t = (key: string, vars?: Record<string, any>): string => {
    return translate(key, translations, fallbackTranslations, vars);
  };

  const value: LanguageContextType = {
    language,
    languages,
    isRTL: isRTL(language),
    loading,
    changeLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
