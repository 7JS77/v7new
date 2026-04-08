'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import type { MarketApiResponse, NormalizedAsset } from '@/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type SortKey = 'name' | 'price' | 'changePercent' | 'symbol';
type FilterCat = 'all' | 'metals' | 'energy' | 'agriculture';

function Skeleton() {
  return (
    <tr>
      {[1,2,3,4,5].map((i) => (
        <td key={i} className="px-4 py-4">
          <div className="skeleton h-4 w-full max-w-24"/>
        </td>
      ))}
    </tr>
  );
}

function Sparkline({ up }: { up: boolean }) {
  const heights = [40, 55, 35, 65, 50, 70, 45, 80, 60, 75];
  return (
    <div className="flex items-end gap-0.5 h-5" aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          className={`block w-0.5 rounded-sm ${up ? 'bg-success' : 'bg-error'}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

export default function MarketTable() {
  const t = useTranslations('markets');
  const [sortKey, setSortKey] = useState<SortKey>('symbol');
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [filter, setFilter] = useState<FilterCat>('all');

  const { data, error, isLoading, mutate } = useSWR<MarketApiResponse>('/api/market', fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else { setSortKey(key); setSortDir(1); }
  }

  const assets = data?.data?.assets ?? [];

  const filtered = assets.filter((a) =>
    filter === 'all' ? true : a.category === filter
  );

  const sorted = [...filtered].sort((a, b) => {
    let av: number | string = a[sortKey as keyof NormalizedAsset] as number | string;
    let bv: number | string = b[sortKey as keyof NormalizedAsset] as number | string;
    if (typeof av === 'string' && typeof bv === 'string') {
      return av.localeCompare(bv) * sortDir;
    }
    return ((av as number) - (bv as number)) * sortDir;
  });

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className="ml-1 text-text-muted inline-flex flex-col leading-none">
      <span className={sortKey === col && sortDir === 1 ? 'text-gold' : ''}>▲</span>
      <span className={sortKey === col && sortDir === -1 ? 'text-gold' : ''}>▼</span>
    </span>
  );

  const filterBtns: { key: FilterCat; label: string }[] = [
    { key: 'all',         label: t('filterAll') },
    { key: 'metals',      label: t('filterMetals') },
    { key: 'energy',      label: t('filterEnergy') },
    { key: 'agriculture', label: t('filterAgri') },
  ];

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6" role="group" aria-label="Filter by category">
        {filterBtns.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`text-xs font-bold tracking-wider uppercase px-4 py-2 border transition-all duration-fast ${
              filter === key
                ? 'border-gold text-gold bg-gold-xsubtle'
                : 'border-border-subtle text-text-secondary hover:border-gold-dark hover:text-text-primary'
            }`}
            aria-pressed={filter === key}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-border-default overflow-hidden responsive-table-wrap">
        <table className="w-full border-collapse" aria-label="Market prices">
          <thead>
            <tr className="bg-ink-3">
              {[
                { key: 'name' as SortKey, label: t('asset') },
                { key: 'price' as SortKey, label: t('price') },
                { key: 'changePercent' as SortKey, label: t('change') },
                { key: null, label: t('trend') },
              ].map(({ key, label }) => (
                <th
                  key={label}
                  scope="col"
                  className={`text-left px-4 py-3 text-xs font-bold tracking-wider uppercase text-text-tertiary border-b border-border-default whitespace-nowrap ${key ? 'cursor-pointer select-none hover:text-gold' : ''}`}
                  onClick={key ? () => handleSort(key) : undefined}
                  aria-sort={key && sortKey === key ? (sortDir === 1 ? 'ascending' : 'descending') : undefined}
                >
                  {label}
                  {key && <SortIcon col={key} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i}/>)}

            {error && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center">
                  <p className="text-sm text-error mb-3">{t('error')}</p>
                  <button onClick={() => mutate()} className="btn-outline text-xs">
                    {t('retry')}
                  </button>
                </td>
              </tr>
            )}

            {!isLoading && !error && sorted.map((asset) => {
              const pos = asset.changePercent >= 0;
              return (
                <tr key={asset.symbol} className="border-b border-border-subtle hover:bg-ink-4 transition-colors duration-fast last:border-0">
                  <td className="sticky-col px-4 py-3">
                    <div className="text-sm font-semibold text-text-primary">{asset.nameDE}</div>
                    <div className="text-xs text-text-tertiary font-mono">{asset.symbol}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-mono text-sm text-text-primary">
                      {asset.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-text-tertiary">{asset.currency}/{asset.unit}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-mono text-xs font-semibold px-2 py-0.5 ${pos ? 'text-success bg-success-bg' : 'text-error bg-error-bg'}`}>
                      {pos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </span>
                    {asset.delayed && (
                      <span className="ml-2 badge-delayed">{t('delayedBadge')}</span>
                    )}
                    {asset.dailySpot && !asset.delayed && (
                      <span className="ml-2 badge-daily">{t('dailyBadge')}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Sparkline up={pos} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Disclaimer */}
      <div className="data-disclaimer mt-4" role="note">
        <svg className="w-3.5 h-3.5 flex-shrink-0 stroke-gold-dark fill-none" viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="5.5" strokeWidth="1.5"/>
          <path d="M7 4.5v3M7 9v.5" strokeLinecap="round" strokeWidth="1.5"/>
        </svg>
        <p className="data-disclaimer-text">
          <strong className="text-text-secondary font-medium">
            {data?.updated ? `${t('lastUpdate')}: ${new Date(data.updated).toLocaleTimeString()} · ` : ''}
          </strong>
          {t('disclaimer')}
        </p>
      </div>
    </div>
  );
}
