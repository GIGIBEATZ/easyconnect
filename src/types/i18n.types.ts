export interface Language {
  code: string;
  name: string;
  native_name: string;
  is_rtl: boolean;
  is_active: boolean;
  flag_emoji: string;
  sort_order: number;
}

export interface TranslationKey {
  id: string;
  key: string;
  namespace: string;
  context?: string;
  created_at: string;
}

export interface Translation {
  id: string;
  key_id: string;
  language_code: string;
  value: string;
  is_verified: boolean;
  updated_at: string;
}

export type TranslationNamespace =
  | 'common'
  | 'nav'
  | 'auth'
  | 'marketplace'
  | 'jobs'
  | 'forms'
  | 'messages'
  | 'footer'
  | 'settings'
  | 'cart'
  | 'profile';

export interface TranslationMap {
  [key: string]: string;
}

export interface LanguageContextType {
  language: string;
  languages: Language[];
  isRTL: boolean;
  loading: boolean;
  changeLanguage: (languageCode: string) => Promise<void>;
  t: (key: string, vars?: Record<string, any>) => string;
}
