'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { INCOTERMS } from '@/lib/incotermsData';

type Filter = 'all' | 'any' | 'sea';

export default function IncotermsPage() {
  const t = useTranslations('incoterms');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = INCOTERMS.filter((i) =>
    filter === 'all' ? true : i.mode === filter
  );

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t('filterAll') },
    { key: 'any', label: t('filterAny') },
    { key: 'sea', label: t('filterSea') },
  ];

  return (
    <div className="px-4 md:px-12 py-20 max-w-7xl mx-auto">
      <div className="section-eyebrow">{t('eyebrow')}</div>
      <h1 className="section-title">{t('title')}</h1>
      <p className="section-subtitle">{t('subtitle')}</p>
      <div className="flex gap-2 flex-wrap mb-8" role="group" aria-label="Filter Incoterms">
        {filters.map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`text-xs font-bold tracking-wider uppercase px-4 py-2 border transition-all duration-fast ${filter === key ? 'border-gold text-gold bg-gold-xsubtle' : 'border-border-subtle text-text-secondary hover:border-gold-dark hover:text-text-primary'}`}
            aria-pressed={filter === key}>
            {label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border-default border border-border-default">
        {filtered.map((inc) => (
          <div key={inc.code} className="bg-ink-3 p-6 hover:bg-ink-4 transition-colors" role="article" aria-label={`${inc.code}: ${inc.name}`}>
            <div className="font-mono text-3xl font-light text-gold mb-1">{inc.code}</div>
            <div className="text-xs font-bold tracking-wide text-text-secondary mb-3">{inc.name}</div>
            <p className="text-sm leading-relaxed text-text-secondary mb-3">{inc.description}</p>
            <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 border border-border-subtle text-text-tertiary">
              {inc.mode === 'any' ? t('modeAny') : t('modeSea')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
