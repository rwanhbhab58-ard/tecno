// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Canonical origin of the production site. Override at build time with
 * SITE_URL=https://example.com npm run build
 */
const SITE_URL = process.env.SITE_URL ?? 'https://technoenjaz.com';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  i18n: {
    defaultLocale: 'ar',
    locales: ['ar', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  image: {
    responsiveStyles: true,
  },
  markdown: {
    syntaxHighlight: false,
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  devToolbar: { enabled: false },
});
