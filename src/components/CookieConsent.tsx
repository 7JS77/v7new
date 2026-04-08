'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCookieConsent } from '@/contexts/CookieContext';
import { useToast } from './ui/Toast';

export default function CookieConsent() {
  const t = useTranslations('cookie');
  const toast = useToast();
  const { showBanner, acceptAll, essentialsOnly, saveSelection } = useCookieConsent();
  const [analyticsChecked, setAnalyticsChecked] = useState(false);

  if (!showBanner) return null;

  function handleAcceptAll() {
    acceptAll();
    toast.success(t('saved'));
  }

  function handleEssentials() {
    essentialsOnly();
    toast.info(t('saved'));
  }

  function handleSave() {
    saveSelection(analyticsChecked);
    toast.success(t('saved'));
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9500] bg-ink-3 border-t border-gold-muted cookie-slide-up"
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
    >
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <svg className="w-5 h-5 text-gold flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" stroke="currentColor" fill="none" strokeWidth="1.5"/>
            <circle cx="8" cy="9" r="1.5" fill="currentColor"/>
            <circle cx="15" cy="8" r="1" fill="currentColor"/>
            <circle cx="10" cy="14" r="1.5" fill="currentColor"/>
            <circle cx="16" cy="13" r="1" fill="currentColor"/>
            <circle cx="13" cy="17" r="1" fill="currentColor"/>
          </svg>
          <h2 id="cookie-title" className="font-display text-xl font-medium text-text-primary">
            {t('title')}
          </h2>
        </div>

        {/* Description */}
        <p id="cookie-desc" className="text-sm text-text-secondary leading-relaxed mb-5">
          {t('description')}{' '}
          <button className="text-gold underline hover:text-gold-light transition-colors text-sm" onClick={() => {}}>
            {t('learnMore')}
          </button>
        </p>

        {/* Categories */}
        <div className="grid gap-3 mb-5">
          {/* Essential */}
          <div className="bg-ink-4 border border-border-default p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-text-primary">{t('essential')}</span>
                <span className="text-xs text-text-tertiary px-2 py-0.5 bg-ink-5">{t('essentialAlways')}</span>
              </div>
              <div className="relative w-11 h-6">
                <input type="checkbox" checked disabled className="sr-only" id="ck-essential"/>
                <label htmlFor="ck-essential" className="block w-11 h-6 bg-gold rounded-full opacity-60 cursor-not-allowed relative">
                  <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-text-primary rounded-full"/>
                </label>
              </div>
            </div>
            <p className="text-xs text-text-tertiary mt-2 leading-relaxed">{t('essentialDesc')}</p>
          </div>

          {/* Analytics */}
          <div className="bg-ink-4 border border-border-default p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-text-primary">{t('analytics')}</span>
                <span className="text-xs text-text-tertiary px-2 py-0.5 bg-ink-5">{t('analyticsOptional')}</span>
              </div>
              <button
                role="switch"
                aria-checked={analyticsChecked}
                onClick={() => setAnalyticsChecked(!analyticsChecked)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-fast focus-visible:outline-2 ${analyticsChecked ? 'bg-gold' : 'bg-ink-5'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-text-primary rounded-full transition-transform duration-fast ${analyticsChecked ? 'left-[1.375rem]' : 'left-0.5'}`}/>
              </button>
            </div>
            <p className="text-xs text-text-tertiary mt-2 leading-relaxed">{t('analyticsDesc')}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={handleAcceptAll} className="btn-primary text-xs">
            {t('acceptAll')}
          </button>
          <button onClick={handleSave} className="btn-outline text-xs">
            {t('saveSelection')}
          </button>
          <button onClick={handleEssentials} className="btn-text text-xs">
            {t('essentialsOnly')}
          </button>
        </div>
      </div>
    </div>
  );
}
