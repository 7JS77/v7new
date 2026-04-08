'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'aurexon-legal-dismissed';

export default function LegalBanner() {
  const t = useTranslations('legalBanner');
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== 'true') {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setDismissed(true);
    setTimeout(() => setVisible(false), 300);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch { /* ignore */ }
  }

  if (!visible) return null;

  return (
    <div
      role="banner"
      aria-label="Legal Notice"
      className={`fixed top-0 left-0 right-0 z-[1000] bg-ink-4 border-b border-gold-muted px-4 md:px-12 py-2 flex items-center justify-between gap-4 transition-transform duration-300 ${dismissed ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="flex items-start gap-3 max-w-6xl mx-auto w-full">
        <svg className="flex-shrink-0 w-4 h-4 text-gold mt-0.5" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="8.5" stroke="currentColor" fill="none" strokeWidth="1.5"/>
          <path d="M10 6.5v4.5M10 13v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <p className="text-xs font-medium text-text-secondary leading-relaxed">
          {t('text')}{' '}
          <strong className="text-gold font-semibold">{t('highlight')}</strong>{' '}
          {t('source')}
        </p>
      </div>
      <button
        onClick={dismiss}
        className="flex-shrink-0 p-1.5 text-text-tertiary hover:text-text-primary transition-colors hover:bg-ink-5 rounded-sm"
        aria-label={t('dismiss')}
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
