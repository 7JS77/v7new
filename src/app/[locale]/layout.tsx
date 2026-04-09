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

// Force dynamic rendering to bypass static generation header issues
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

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
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
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    robots: { index: true, follow: true },
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

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;
  if (!isValidLocale(locale)) notFound();

  // FIX 1: getMessages must be called with NO arguments
  const messages = await getMessages();
  const logoB64 = getLogoB64();

  return (
    // FIX 2: suppressHydrationWarning stops browser extensions from crashing your app!
    <html lang={locale === 'de' ? 'de-AT' : locale} className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Syne:wght@400;500;600;700&family=JetBrains+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink text-text-primary" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <CookieProvider>
            <ToastProvider>
              {/* Skip link */}
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
