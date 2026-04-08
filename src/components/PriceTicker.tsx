'use client';

import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import type { MarketApiResponse } from '@/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function PriceTicker({ bannerDismissed }: { bannerDismissed?: boolean }) {
  const t = useTranslations('ticker');
  const { data } = useSWR<MarketApiResponse>('/api/market', fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });

  const assets = data?.data?.assets ?? [];

  const items = assets.length > 0
    ? assets
    : Array.from({ length: 10 }, (_, i) => ({
        symbol: `ASSET${i}`,
        name: '---',
        nameDE: '---',
        price: 0,
        changePercent: 0,
        change: 0,
        delayed: true,
      }));

  // Double for seamless loop
  const doubledItems = [...items, ...items];

  const topClass = bannerDismissed ? 'top-16' : 'top-[100px]';

  return (
    <div
      className={`fixed ${topClass} left-0 right-0 z-[800] h-8 bg-ink-3 border-b border-border-default flex items-center overflow-hidden transition-all duration-300`}
      role="marquee"
      aria-label={`${t('label')} - ${t('disclaimer')}`}
    >
      {/* Label */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 h-full bg-ink-4 border-r border-border-default" aria-hidden="true">
        <svg className="w-3 h-3" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="3" fill="#3DAA72"/>
          <circle cx="8" cy="8" r="6.5" stroke="#3DAA72" fill="none" strokeWidth="1" opacity="0.45"/>
        </svg>
        <span className="text-xs font-bold tracking-ultra uppercase text-gold">{t('label')}</span>
      </div>

      {/* Scrolling track */}
      <div className="flex-1 overflow-hidden" aria-hidden="true">
        <div className="ticker-scroll flex">
          {doubledItems.map((asset, idx) => {
            const pos = asset.changePercent >= 0;
            return (
              <div
                key={`${asset.symbol}-${idx}`}
                className="flex items-center gap-3 px-5 h-8 border-r border-border-subtle flex-shrink-0"
              >
                <span className="font-mono text-xs font-bold tracking-wide text-text-secondary">
                  {asset.name || asset.symbol}
                </span>
                {asset.price > 0 && (
                  <>
                    <span className="font-mono text-sm text-text-primary min-w-16 text-right">
                      {asset.price.toFixed(2)}
                    </span>
                    <span className={`font-mono text-xs font-semibold px-1 py-0.5 min-w-12 text-center ${
                      pos ? 'text-success bg-success-bg' : 'text-error bg-error-bg'
                    }`}>
                      {pos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Source */}
      <div className="flex-shrink-0 flex items-center gap-1.5 px-3 h-full border-l border-border-subtle hidden sm:flex" aria-label="Data source">
        {data?.source_delay && (
          <span className="font-mono text-xs text-warning">⚠</span>
        )}
        <span className="text-xs text-text-tertiary">{t('source')}</span>
        <a
          href="https://twelvedata.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gold-dark hover:text-gold transition-colors"
        >
          Twelve Data
        </a>
      </div>
    </div>
  );
}
