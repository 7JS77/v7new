import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/lib/i18n';
import { CookieProvider } from '@/contexts/CookieContext';
import { ToastProvider } from '@/components/ui/Toast';
import Navigation from '@/components/Navigation';
import LegalBanner from '@/components/LegalBanner';
import PriceTicker from '@/components/PriceTicker';
import CookieConsent from '@/components/CookieConsent';
import Footer from '@/components/Footer';
import '@/app/globals.css';

export const dynamic = 'force-dynamic';

// Logo base64 - loaded server-side
import { readFileSync } from 'fs';
import { join } from 'path';

function getLogoB64(): string {
  try {
    const logoPath = join(process.cwd(), 'public', 'logo.jpg');
    return readFileSync(logoPath).toString('base64');
  } catch {
    return '';
  }
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  if (!isValidLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://aurexon.at'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale === 'de' ? 'de_AT' : locale,
      siteName: 'Aurexon GmbH',
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'de': '/de',
        'en': '/en',
        'es': '/es',
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode, params: { locale: string } }) {
  const { locale } = params;
  if (!isValidLocale(locale)) notFound();

  const messages = await getMessages();
  const logoB64 = getLogoB64();

  // FIX: The manual <head> tag has been completely removed to prevent Duplicate DOM elements.
  // Next.js handles metadata automatically, and your fonts are already safely loaded via globals.css!
  return (
    <html lang={locale === 'de' ? 'de-AT' : locale} className="scroll-smooth" suppressHydrationWarning>
      <body className="bg-ink text-text-primary" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <CookieProvider>
            <ToastProvider>
              <a href="#main-content" className="skip-link">
                {locale === 'de' ? 'Zum Hauptinhalt springen' : locale === 'es' ? 'Saltar al contenido' : 'Skip to main content'}
              </a>

              <LegalBanner />
              <Navigation locale={locale as Locale} logoB64={logoB64} />
              <PriceTicker />

              <main id="main-content" className="pt-[138px]" tabIndex={-1}>
                {children}
              </main>

              <Footer locale={locale as Locale} logoB64={logoB64} />
              <CookieConsent />
            </ToastProvider>
          </CookieProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
