'use client';

import { buildTheme } from '@/src/lib/theme';
import { CssBaseline, ThemeProvider as MuiThemeProvider, PaletteMode } from '@mui/material';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = '@portfolio:color-mode';

interface ColorModeContextValue {
  mode: PaletteMode;
  toggleMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue>({
  mode: 'dark',
  toggleMode: () => {},
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>('dark');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as PaletteMode | null;
    if (stored === 'light' || stored === 'dark') setMode(stored);
  }, []);

  const toggleMode = () => {
    setMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}
