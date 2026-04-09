import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n';

interface FooterProps {
  locale: Locale;
  logoB64: string;
}

export default function Footer({ locale, logoB64 }: FooterProps) {
  const t = useTranslations('footer');
  const nt = useTranslations('nav');

  return (
    <footer className="bg-ink border-t border-border-default pt-16 pb-8 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10 pb-10 border-b border-border-subtle">
          {/* Brand */}
          <div>
            <Link href={`/${locale}`} className="flex items-center gap-3 mb-4">
              {logoB64 ? (
                <img 
                  src={`data:image/jpeg;base64,${logoB64}`} 
                  alt="Aurexon GmbH Logo" 
                  width={26} 
                  height={23} 
                  className="object-contain"
                />
              ) : (
                <div className="w-6 h-6 bg-gold/20 border border-gold flex items-center justify-center text-[10px] text-gold">A</div>
              )}
              <span className="font-display text-xl font-medium tracking-wide leading-none">
                Aurexon <strong className="text-gold font-medium">GmbH</strong>
              </span>
            </Link>
            <p className="text-xs text-text-tertiary leading-relaxed max-w-56">{t('tagline')}</p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold tracking-ultra uppercase text-text-secondary mb-4">{t('platform')}</h4>
            <ul className="flex flex-col gap-2.5 list-none">
              {[
                { href: '/intermediation', label: nt('intermediation') },
                { href: '/markets',        label: t('markets') },
                { href: '/intelligence',   label: t('intelligence') },
                { href: '/contact',        label: t('contact') },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={`/${locale}${href}`} className="text-sm text-text-tertiary hover:text-gold transition-colors duration-fast">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Commodities */}
          <div>
            <h4 className="text-xs font-bold tracking-ultra uppercase text-text-secondary mb-4">{t('commoditiesCol')}</h4>
            <ul className="flex flex-col gap-2.5 list-none">
              {[
                { href: '/commodities', label: t('metals') },
                { href: '/commodities', label: t('energy') },
                { href: '/commodities', label: t('agriculture') },
                { href: '/incoterms',   label: nt('incoterms') },
              ].map(({ href, label }, i) => (
                <li key={i}>
                  <Link href={`/${locale}${href}`} className="text-sm text-text-tertiary hover:text-gold transition-colors duration-fast">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold tracking-ultra uppercase text-text-secondary mb-4">{t('legalCol')}</h4>
            <ul className="flex flex-col gap-2.5 list-none">
              {[
                { href: '/impressum',           label: t('impressum') },
                { href: '/agb',                 label: t('agb') },
                { href: '/datenschutz',         label: t('datenschutz') },
                { href: '/haftungsausschluss',   label: t('haftungsausschluss') },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={`/${locale}${href}`} className="text-sm text-text-tertiary hover:text-gold transition-colors duration-fast">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-text-tertiary">{t('copy')}</p>
          <div className="flex gap-0 flex-wrap">
            {[
              { href: '/impressum',         label: t('impressum') },
              { href: '/datenschutz',       label: t('datenschutz') },
              { href: '/haftungsausschluss', label: t('haftungsausschluss') },
            ].map(({ href, label }, i) => (
              <Link
                key={href}
                href={`/${locale}${href}`}
                className={`text-xs text-text-tertiary hover:text-gold transition-colors duration-fast px-3 ${i > 0 ? 'border-l border-border-subtle' : 'pl-0'}`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Legal disclaimer */}
        <p className="text-xs text-text-tertiary leading-relaxed mt-3 max-w-3xl" role="note">
          {t('disclaimer')}
        </p>
      </div>
    </footer>
  );
}
