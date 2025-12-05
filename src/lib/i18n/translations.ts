import { supabase } from '../supabase';
import { TranslationMap } from '../../types/i18n.types';
import { FALLBACK_LANGUAGE } from './languages';

const translationCache: Map<string, TranslationMap> = new Map();

export const loadTranslations = async (languageCode: string): Promise<TranslationMap> => {
  if (translationCache.has(languageCode)) {
    return translationCache.get(languageCode)!;
  }

  try {
    const { data, error } = await supabase
      .from('translations')
      .select(`
        value,
        translation_keys!inner(key)
      `)
      .eq('language_code', languageCode);

    if (error) throw error;

    const translationMap: TranslationMap = {};
    data?.forEach((item: any) => {
      translationMap[item.translation_keys.key] = item.value;
    });

    translationCache.set(languageCode, translationMap);
    return translationMap;
  } catch (error) {
    console.error('Error loading translations:', error);
    return {};
  }
};

export const translate = (
  key: string,
  translations: TranslationMap,
  fallbackTranslations: TranslationMap,
  variables?: Record<string, any>
): string => {
  let text = translations[key] || fallbackTranslations[key] || key;

  if (variables) {
    Object.keys(variables).forEach((varKey) => {
      const regex = new RegExp(`{{${varKey}}}`, 'g');
      text = text.replace(regex, String(variables[varKey]));
    });
  }

  return text;
};

export const clearTranslationCache = () => {
  translationCache.clear();
};

export const interpolate = (text: string, vars: Record<string, any>): string => {
  let result = text;
  Object.keys(vars).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(vars[key]));
  });
  return result;
};

export const getStoredLanguage = (): string | null => {
  return localStorage.getItem('preferred_language');
};

export const setStoredLanguage = (languageCode: string): void => {
  localStorage.setItem('preferred_language', languageCode);
};
