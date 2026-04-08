'use client';

import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import type { NewsApiResponse, NewsArticle } from '@/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function relativeTime(iso: string, t: ReturnType<typeof useTranslations<'intelligence'>>): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return t('justNow');
  if (diff < 3600) return t('minsAgo', { n: Math.floor(diff / 60) });
  if (diff < 86400) return t('hrsAgo', { n: Math.floor(diff / 3600) });
  return t('daysAgo', { n: Math.floor(diff / 86400) });
}

const TAG_CLASSES: Record<NewsArticle['category'], string> = {
  energy:      'text-gold bg-gold-xsubtle border border-gold-dark',
  metals:      'text-info bg-blue-900/20 border border-blue-800',
  agriculture: 'text-success bg-success-bg border border-success/30',
  general:     'text-text-secondary bg-ink-4 border border-border-subtle',
};

function NewsCardSkeleton() {
  return (
    <div className="bg-ink-3 border border-border-default p-8 flex flex-col gap-4">
      <div className="skeleton h-5 w-20"/>
      <div className="skeleton h-3 w-28"/>
      <div className="skeleton h-6 w-full"/>
      <div className="skeleton h-6 w-3/4"/>
      <div className="skeleton h-4 w-full"/>
      <div className="skeleton h-4 w-5/6"/>
      <div className="skeleton h-3 w-24 mt-auto"/>
    </div>
  );
}

function NewsCard({ article, t }: { article: NewsArticle; t: ReturnType<typeof useTranslations<'intelligence'>> }) {
  const tagLabels: Record<NewsArticle['category'], string> = {
    energy:      t('tagEnergy'),
    metals:      t('tagMetals'),
    agriculture: t('tagAgri'),
    general:     t('tagGeneral'),
  };

  return (
    <article className="bg-ink-3 border border-border-default p-8 flex flex-col gap-3 hover:bg-ink-4 transition-colors duration-fast cursor-pointer group">
      <div className="flex items-center gap-3 flex-wrap">
        <span className={`text-xs font-bold tracking-wider uppercase px-2 py-0.5 ${TAG_CLASSES[article.category]}`}>
          {tagLabels[article.category]}
        </span>
        <span className="text-xs text-text-tertiary">
          {article.source} · {relativeTime(article.publishedAt, t)}
        </span>
      </div>
      <h3 className="font-display text-xl font-400 leading-snug text-text-primary group-hover:text-gold transition-colors duration-fast">
        {article.title}
      </h3>
      <p className="text-sm leading-relaxed text-text-secondary line-clamp-3 flex-1">
        {article.summary}
      </p>
      {article.url && article.url !== '#' && (
        <a
          href={article.url}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="text-xs font-bold tracking-wider uppercase text-gold inline-flex items-center gap-2 hover:gap-3 transition-all duration-fast mt-1 w-fit"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Read full article: ${article.title}`}
        >
          {t('readMore')} →
        </a>
      )}
    </article>
  );
}

export default function NewsGrid() {
  const t = useTranslations('intelligence');
  const { data, error, isLoading } = useSWR<NewsApiResponse>('/api/news', fetcher, {
    refreshInterval: 1800000, // 30 min
    revalidateOnFocus: false,
  });

  return (
    <div>
      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border-default border border-border-default mb-8">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <NewsCardSkeleton key={i}/>)}

        {error && (
          <div className="col-span-full p-8 text-center bg-ink-3">
            <p className="text-sm text-error">{t('error')}</p>
          </div>
        )}

        {!isLoading && !error && data?.articles.length === 0 && (
          <div className="col-span-full p-8 text-center bg-ink-3">
            <p className="text-sm text-text-secondary">{t('noArticles')}</p>
          </div>
        )}

        {!isLoading && !error && data?.articles.map((article) => (
          <NewsCard key={article.id} article={article} t={t} />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="data-disclaimer" role="note">
        <svg className="w-3.5 h-3.5 flex-shrink-0 stroke-gold-dark fill-none" viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="5.5" strokeWidth="1.5"/>
          <path d="M7 4.5v3M7 9v.5" strokeLinecap="round" strokeWidth="1.5"/>
        </svg>
        <p className="data-disclaimer-text">{t('disclaimer')}</p>
      </div>
    </div>
  );
}
