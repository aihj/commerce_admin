'use client';

import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

import { createTheme } from '@/styles/theme/create-theme';
import { config } from '@/config';

import EmotionCache from './EmotionCache';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps): React.JSX.Element => {
  const theme = createTheme({
    primaryColor: config.site.primaryColor,
    colorScheme: config.site.colorScheme,
  });

  return (
    <EmotionCache options={{ key: 'mui' }}>
      <CssVarsProvider
        defaultColorScheme={config.site.colorScheme}
        defaultMode={config.site.colorScheme}
        theme={theme}
      >
        <CssBaseline />
        {children}
      </CssVarsProvider>
    </EmotionCache>
  );
};
export { ThemeProvider };
