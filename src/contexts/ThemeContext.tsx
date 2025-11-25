import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

type ThemeMode = 'light' | 'dark' | 'system';
type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'red';

interface ThemeContextType {
  themeMode: ThemeMode;
  effectiveTheme: 'light' | 'dark';
  colorScheme: ColorScheme;
  setThemeMode: (mode: ThemeMode) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { user } = useAuth();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('blue');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');
  const [loading, setLoading] = useState(true);

  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  const calculateEffectiveTheme = (mode: ThemeMode): 'light' | 'dark' => {
    if (mode === 'system') {
      return getSystemTheme();
    }
    return mode;
  };

  useEffect(() => {
    const loadPreferences = async () => {
      const storedMode = localStorage.getItem('themeMode') as ThemeMode | null;
      const storedScheme = localStorage.getItem('colorScheme') as ColorScheme | null;

      if (storedMode) {
        setThemeModeState(storedMode);
        setEffectiveTheme(calculateEffectiveTheme(storedMode));
      } else {
        setEffectiveTheme(getSystemTheme());
      }

      if (storedScheme) {
        setColorSchemeState(storedScheme);
      }

      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('theme_mode, color_scheme')
            .eq('user_id', user.id)
            .maybeSingle();

          if (data && !error) {
            setThemeModeState(data.theme_mode as ThemeMode);
            setColorSchemeState(data.color_scheme as ColorScheme);
            setEffectiveTheme(calculateEffectiveTheme(data.theme_mode as ThemeMode));

            localStorage.setItem('themeMode', data.theme_mode);
            localStorage.setItem('colorScheme', data.color_scheme);
          }
        } catch (error) {
          console.error('Error loading theme preferences:', error);
        }
      }

      setLoading(false);
    };

    loadPreferences();
  }, [user]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (themeMode === 'system') {
        setEffectiveTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  useEffect(() => {
    const root = window.document.documentElement;

    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [effectiveTheme]);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    setEffectiveTheme(calculateEffectiveTheme(mode));
    localStorage.setItem('themeMode', mode);

    if (user) {
      try {
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            theme_mode: mode,
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error saving theme mode:', error);
      }
    }
  };

  const setColorScheme = async (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    localStorage.setItem('colorScheme', scheme);

    if (user) {
      try {
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            color_scheme: scheme,
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error saving color scheme:', error);
      }
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        effectiveTheme,
        colorScheme,
        setThemeMode,
        setColorScheme,
        loading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
