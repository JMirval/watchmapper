import createMiddleware from 'next-intl/middleware';
import { locales } from './src/types';

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: 'fr',

  // Always show the locale in the URL
  localePrefix: 'always',

  // Enable locale detection
  localeDetection: true
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fr|en)/:path*', '/((?!_next|api|.*\\..*).*)']
};
