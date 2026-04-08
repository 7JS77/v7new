import { getTranslations } from 'next-intl/server';
import NewsGrid from '@/components/NewsGrid';
import type { Locale } from '@/lib/i18n';

export default async function IntelligencePage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'intelligence' });
  return (
    <div className="px-4 md:px-12 py-20 max-w-7xl mx-auto">
      <div className="section-eyebrow">{t('eyebrow')}</div>
      <h1 className="section-title">{t('title')}</h1>
      <p className="section-subtitle">{t('subtitle')}</p>
      <NewsGrid />
    </div>
  );
}
