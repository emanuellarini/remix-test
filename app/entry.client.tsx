import React from 'react';
import { hydrate } from 'react-dom';
import { RemixBrowser } from "@remix-run/react";
import { CacheProvider, ThemeProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';

import createEmotionCache from './utils/createEmotionCache';
import theme from './utils/theme';

const emotionCache = createEmotionCache();

hydrate(
  <CacheProvider value={emotionCache}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RemixBrowser />
    </ThemeProvider>
  </CacheProvider>,
  document,
);
