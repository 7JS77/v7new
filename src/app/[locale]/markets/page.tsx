import { getTranslations } from 'next-intl/server';
import MarketTable from '@/components/MarketTable';
import type { Locale } from '@/lib/i18n';

export default async function MarketsPage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'markets' });
  return (
    <div className="px-4 md:px-12 py-20 max-w-7xl mx-auto">
      <div className="section-eyebrow">{t('eyebrow')}</div>
      <h1 className="section-title">{t('subtitle')}</h1>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <span className="live-dot text-xs">{t('status')}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border-default border border-border-default mb-8">
        {[
          { label: t('composite'), val: '1,490.25', meta: '+0.8%', pos: true },
          { label: t('volume'),    val: '$42.8B',   meta: t('allDesks'), pos: null },
          { label: t('vix'),       val: '18.42',    meta: '-1.2%', pos: false },
          { label: t('latency'),   val: '12ms',     meta: t('engine'), pos: true },
        ].map(({ label, val, meta, pos }) => (
          <div key={label} className="bg-ink-3 px-6 py-5">
            <div className="text-xs font-bold tracking-wider uppercase text-text-tertiary mb-1.5">{label}</div>
            <div className="font-mono text-xl text-text-primary mb-1">{val}</div>
            <div className={`text-xs ${pos === true ? 'text-success' : pos === false ? 'text-error' : 'text-text-tertiary'}`}>{meta}</div>
          </div>
        ))}
      </div>
      <MarketTable />
    </div>
  );
}
