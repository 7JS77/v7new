import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

export default async function AboutPage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'about' });

  const stats = [
    { val: '$4.2B+', label: t('s1') },
    { val: '45+',    label: t('s2') },
    { val: '120+',   label: t('s3') },
    { val: '24/7',   label: t('s4') },
  ];

  const features = [
    { icon: (
      <svg className="w-3.5 h-3.5 stroke-gold fill-none flex-shrink-0" viewBox="0 0 16 16">
        <path d="M8 1.5L14.5 13H1.5L8 1.5z" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M8 7v3M8 11.5v.5" strokeLinecap="round" strokeWidth="1.4"/>
      </svg>
    ), text: t('feat1') },
    { icon: (
      <svg className="w-3.5 h-3.5 stroke-gold fill-none flex-shrink-0" viewBox="0 0 16 16">
        <rect x="2" y="3" width="12" height="10" rx="1" strokeWidth="1.4"/>
        <path d="M5 7h6M5 10h4" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ), text: t('feat2') },
    { icon: (
      <svg className="w-3.5 h-3.5 stroke-gold fill-none flex-shrink-0" viewBox="0 0 16 16">
        <path d="M8 2l1.5 4.5H14l-4 2.5 1.5 4.5L8 11l-3.5 2.5 1.5-4.5-4-2.5h4.5z" strokeWidth="1.2"/>
      </svg>
    ), text: t('feat3') },
    { icon: (
      <svg className="w-3.5 h-3.5 stroke-gold fill-none flex-shrink-0" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="6" strokeWidth="1.4"/>
        <path d="M8 5v3l2 2" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ), text: t('feat4') },
  ];

  return (
    <div className="px-4 md:px-12 py-20 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Left: text */}
        <div>
          <div className="section-eyebrow">{t('eyebrow')}</div>
          <h1 className="section-title">{t('title')}</h1>

          <p className="text-sm leading-[1.85] text-text-secondary mb-4">{t('p1')}</p>
          <p className="text-sm leading-[1.85] text-text-secondary mb-4">{t('p2')}</p>
          <p className="text-sm leading-[1.85] text-text-secondary mb-4">{t('p3')}</p>

          {/* Legal note */}
          <div className="text-xs text-text-tertiary px-4 py-3 bg-ink-4 border-l-2 border-border-default leading-relaxed mb-4">
            {t('legalNote')}
          </div>

          {/* Quote */}
          <blockquote className="bg-ink-4 border-l-2 border-gold-dark px-8 py-6 mt-6">
            <p className="font-display text-xl italic font-light text-text-secondary leading-relaxed">{t('quote')}</p>
            <cite className="text-xs font-bold tracking-wider uppercase text-text-tertiary not-italic mt-3 block">{t('cite')}</cite>
          </blockquote>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-px bg-border-default border border-border-default mt-10">
            {stats.map(({ val, label }) => (
              <div key={label} className="bg-ink-3 px-5 py-6">
                <div className="font-display text-4xl font-light text-gold leading-none mb-1">{val}</div>
                <div className="text-xs text-text-tertiary tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: panel */}
        <div className="lg:sticky lg:top-24">
          <div className="bg-ink-3 border border-border-default p-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-6 bg-gold-xsubtle border border-gold-dark flex items-center justify-center text-xs font-bold text-gold">A</div>
              <span className="font-display text-xl font-medium tracking-wide">Aurexon <strong className="text-gold font-medium">GmbH</strong></span>
            </div>
            <p className="text-xs leading-[1.75] text-text-secondary mb-5">{t('panelBody')}</p>

            <div className="flex flex-col gap-2 mb-6">
              {features.map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 bg-ink-4 border border-border-subtle px-4 py-3">
                  {icon}
                  <span className="text-xs text-text-secondary">{text}</span>
                </div>
              ))}
            </div>

            <Link href={`/${locale}/intermediation`} className="btn-primary w-full text-center block">
              {t('ctaBtn')}
            </Link>
            <p className="text-xs text-text-tertiary text-center mt-2">{t('ctaNote')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
