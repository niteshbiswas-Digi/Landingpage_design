'use client';
import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

export const COLORS = {
  dark: {
    bg: '#050505',
    bgSection: '#080808',
    bgCard: '#0d0d0d',
    bgCardHover: 'rgba(255,255,255,0.055)',
    text: '#f0f0f0',
    textSub: '#a0a0a0',
    textMuted: '#666',
    textFaint: '#555',
    border: 'rgba(255,255,255,0.05)',
    borderStrong: '#1a1a1a',
    accent: '#4ADE80',
    navBgScrolled: 'rgba(5,5,5,0.88)',
    navText: '#a0a0a0',
    navTextHover: '#f0f0f0',
    navTextActive: '#4ADE80',
    megaBg: 'rgba(7,7,7,0.97)',
    overlay: 'rgba(5,5,5,0.97)',
    isDark: true as const,
    shadow: 'none',
    cardShadow: '0 4px 32px rgba(0,0,0,0.3)',
    inputBorder: 'rgba(255,255,255,0.12)',
    dotGrid: 'rgba(255,255,255,0.022)',
  },
  light: {
    bg: '#FAFAF8',
    bgSection: '#F2F0EB',
    bgCard: '#FFFFFF',
    bgCardHover: 'rgba(0,0,0,0.025)',
    text: '#0A0A0A',
    textSub: '#4A4A4A',
    textMuted: '#6B7280',
    textFaint: '#9CA3AF',
    border: 'rgba(0,0,0,0.08)',
    borderStrong: '#D1D5DB',
    accent: '#16A34A',
    navBgScrolled: 'rgba(250,250,248,0.96)',
    navText: '#374151',
    navTextHover: '#0A0A0A',
    navTextActive: '#15803D',
    megaBg: 'rgba(253,253,251,0.99)',
    overlay: 'rgba(250,250,248,0.98)',
    isDark: false as const,
    shadow: '0 1px 4px rgba(0,0,0,0.08)',
    cardShadow: '0 4px 24px rgba(0,0,0,0.06)',
    inputBorder: 'rgba(0,0,0,0.15)',
    dotGrid: 'rgba(0,0,0,0.035)',
  },
} as const;

type Colors = typeof COLORS.dark | typeof COLORS.light;

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
  c: Colors;
}

const Ctx = createContext<ThemeCtx>({ theme: 'dark', toggle: () => {}, c: COLORS.dark });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('uc-theme') as Theme | null;
    const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const initial = saved ?? preferred;
    apply(initial);
    setTheme(initial);
  }, []);

  function apply(t: Theme) {
    document.documentElement.setAttribute('data-theme', t);
    document.body.style.background = COLORS[t].bg;
    document.body.style.color = COLORS[t].text;
    document.documentElement.style.colorScheme = t;
  }

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('uc-theme', next);
    apply(next);
    setTheme(next);
  };

  return <Ctx.Provider value={{ theme, toggle, c: COLORS[theme] }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
