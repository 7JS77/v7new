'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

// FIX: We define these directly here so we don't accidentally import server-side code into the browser!
type Locale = 'de' | 'en' | 'es';
const locales: Locale[] = ['de', 'en', 'es'];
const localeNames: Record<Locale, string> = { de: 'Deutsch', en: 'English', es: 'Español' };
const localeFlags: Record<Locale, string> = { de: '🇦🇹', en: '🇬🇧', es: '🇪🇸' };

interface NavLink {
  href: string;
  labelKey: string;
}

const NAV_LINKS: NavLink[] = [
  { href: '/',              labelKey: 'home' },
  { href: '/markets',       labelKey: 'markets' },
  { href: '/commodities',   labelKey: 'commodities' },
  { href: '/intelligence',  labelKey: 'intelligence' },
  { href: '/incoterms',     labelKey: 'incoterms' },
  { href: '/about',         labelKey: 'about' },
  { href: '/contact',       labelKey: 'contact' },
];

interface NavigationProps {
  locale: Locale;
  logoB64: string;
}

export default function Navigation({ locale, logoB64 }: NavigationProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setBannerDismissed(localStorage.getItem('aurexon-legal-dismissed') === 'true');
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function switchLocale(newLocale: Locale) {
    setLangOpen(false);
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    try { localStorage.setItem('aurexon-lang', newLocale); } catch { /* ignore */ }
    router.push(newPath);
  }

  function isActive(href: string) {
    const localePath = `/${locale}${href === '/' ? '' : href}`;
    return href === '/'
      ? pathname === `/${locale}` || pathname === `/${locale}/`
      : pathname.startsWith(localePath);
  }

  const topOffset = bannerDismissed ? 'top-0' : 'top-9';

  return (
    <>
      <nav
        id="main-nav"
        role="navigation"
        aria-label="Main navigation"
        className={`fixed ${topOffset} left-0 right-0 z-[900] flex items-center justify-between px-4 md:px-11 h-16 bg-ink/92 backdrop-blur-xl border-b border-border-default transition-all duration-300 gap-4`}
      >
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-3 flex-shrink-0" aria-label="Aurexon GmbH – Home">
          {logoB64 ? (
            <img
              src={`data:image/jpeg;base64,${logoB64}`}
              alt="Aurexon GmbH Logo"
              width={28}
              height={25}
              className="object-contain"
            />
          ) : (
            <div className="w-7 h-7 bg-gold/20 border border-gold flex items-center justify-center text-xs text-gold">A</div>
          )}
          <span className="font-display text-xl font-medium tracking-wide leading-none">
            Aurexon <strong className="text-gold font-medium">GmbH</strong>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-6 list-none" role="list">
          {NAV_LINKS.map(({ href, labelKey }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={`/${locale}${href === '/' ? '' : href}`}
                  className={`text-xs font-semibold tracking-widest uppercase pb-0.5 relative transition-colors duration-fast hover:text-gold after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:bg-gold after:transition-all after:duration-300 ${
                    active
                      ? 'text-gold after:right-0'
                      : 'text-text-secondary after:right-full hover:after:right-0'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {t(labelKey)}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Language switcher */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-text-secondary border border-border-subtle px-3 py-2 hover:border-gold-dark hover:text-text-primary transition-all duration-fast"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label="Change language"
            >
              <span>{locale.toUpperCase()}</span>
              <svg className={`w-2.5 h-2.5 transition-transform duration-fast ${langOpen ? 'rotate-180' : ''}`} viewBox="0 0 12 12" aria-hidden="true">
                <polyline points="2,4 6,8 10,4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {langOpen && (
              <ul
                role="listbox"
                aria-label="Languages"
                className="absolute top-[calc(100%+6px)] right-0 bg-ink-3 border border-border-default min-w-36 z-50 py-1 shadow-lg"
              >
                {locales.map((loc) => (
                  <li
                    key={loc}
                    role="option"
                    aria-selected={loc === locale}
                    onClick={() => switchLocale(loc)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium cursor-pointer transition-all duration-fast ${
                      loc === locale
                        ? 'text-gold bg-gold-xsubtle'
                        : 'text-text-secondary hover:text-gold hover:bg-gold-xsubtle'
                    }`}
                  >
                    <span className="text-base">{localeFlags[loc]}</span>
                    {localeNames[loc]}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* CTA button */}
          <Link
            href={`/${locale}/intermediation`}
            className="hidden lg:inline-block btn-primary text-xs"
          >
            {t('cta')}
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex lg:hidden flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer"
            aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <span className={`block w-5.5 h-0.5 bg-text-primary transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5.5 h-0.5 bg-text-primary transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5.5 h-0.5 bg-text-primary transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        aria-hidden={!mobileOpen}
        className={`fixed left-0 right-0 z-[800] bg-ink/98 backdrop-blur-xl border-b border-border-default px-7 pb-6 transition-all duration-300 overflow-y-auto ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        style={{ top: bannerDismissed ? '64px' : '100px' }}
      >
        <nav aria-label="Mobile navigation">
          {NAV_LINKS.map(({ href, labelKey }) => (
            <Link
              key={href}
              href={`/${locale}${href === '/' ? '' : href}`}
              className="block text-lg font-semibold tracking-wider uppercase text-text-secondary py-4 border-b border-border-subtle hover:text-gold transition-colors duration-fast"
              aria-current={isActive(href) ? 'page' : undefined}
            >
              {t(labelKey)}
            </Link>
          ))}
          <Link
            href={`/${locale}/intermediation`}
            className="block mt-6 btn-primary text-center text-xs"
          >
            {t('cta')}
          </Link>
          {/* Mobile language */}
          <div className="mt-6 flex gap-3 flex-wrap">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-bold tracking-wider uppercase border transition-all duration-fast ${
                  loc === locale
                    ? 'border-gold text-gold bg-gold-xsubtle'
                    : 'border-border-subtle text-text-secondary hover:border-gold-dark hover:text-text-primary'
                }`}
              >
                {localeFlags[loc]} {loc.toUpperCase()}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
