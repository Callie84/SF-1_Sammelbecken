import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import options from './themes.json';

type ThemeKey = string;

type Ctx = {
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
  themes: { key: string; label: string }[];
};

const ThemeCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = 'sf1-theme';

function applyTheme(key: ThemeKey){
  if(key === 'system'){
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', prefers);
  } else {
    document.documentElement.setAttribute('data-theme', key);
  }
}

export function ThemeProvider({ children }:{ children: React.ReactNode }){
  const [theme, setThemeState] = useState<ThemeKey>(() => {
    const v = localStorage.getItem(STORAGE_KEY);
    return v || options.default || 'light';
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    if(theme === 'system'){
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  const value = useMemo<Ctx>(() => ({
    theme,
    setTheme: (t: ThemeKey) => setThemeState(t),
    themes: options.available
  }), [theme]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useThemeCtx(){
  const ctx = useContext(ThemeCtx);
  if(!ctx) throw new Error('ThemeProvider fehlt');
  return ctx;
}