// This file configures the initialization of Sentry on the client.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Low sample rate — only capture a fraction of errors to avoid overhead
  tracesSampleRate: 0,
  debug: false,
  enabled: process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  // No BrowserTracing or Replay — both add significant JS weight (50-100 KB)
  // and BrowserTracing monkey-patches fetch/XHR, causing TBT regressions.
  integrations: [],
});
