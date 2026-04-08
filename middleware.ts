import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['de', 'en', 'es'],
  defaultLocale: 'de',
  localePrefix: 'always',
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
