export const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export const isRTL = (languageCode: string): boolean => {
  return RTL_LANGUAGES.includes(languageCode);
};

export const getLanguageDirection = (languageCode: string): 'ltr' | 'rtl' => {
  return isRTL(languageCode) ? 'rtl' : 'ltr';
};

export const POPULAR_LANGUAGES = [
  'en', 'es', 'fr', 'de', 'pt', 'ru', 'zh-CN', 'ja', 'ko', 'ar', 'hi', 'it'
];

export const DEFAULT_LANGUAGE = 'en';

export const FALLBACK_LANGUAGE = 'en';
