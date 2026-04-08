'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { CookieConsent } from '@/types';

interface CookieContextValue {
  consent: CookieConsent | null;
  showBanner: boolean;
  acceptAll: () => void;
  essentialsOnly: () => void;
  saveSelection: (analytics: boolean) => void;
  hasConsent: (category: keyof Omit<CookieConsent, 'timestamp'>) => boolean;
}

const STORAGE_KEY = 'aurexon-cookie-consent';

const CookieContext = createContext<CookieContextValue | null>(null);

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CookieConsent;
        setConsent(parsed);
        setShowBanner(false);
      } else {
        setTimeout(() => setShowBanner(true), 1500);
      }
    } catch {
      setTimeout(() => setShowBanner(true), 1500);
    }
  }, []);

  const save = useCallback((config: Omit<CookieConsent, 'timestamp'>) => {
    const full: CookieConsent = { ...config, timestamp: Date.now() };
    setConsent(full);
    setShowBanner(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    } catch { /* ignore */ }
    // Set analytics flag
    if (typeof window !== 'undefined') {
      (window as Window & { aurexonAnalytics?: boolean }).aurexonAnalytics = full.analytics;
    }
  }, []);

  const acceptAll = useCallback(() => save({ essential: true, analytics: true }), [save]);
  const essentialsOnly = useCallback(() => save({ essential: true, analytics: false }), [save]);
  const saveSelection = useCallback((analytics: boolean) => save({ essential: true, analytics }), [save]);

  const hasConsent = useCallback(
    (category: keyof Omit<CookieConsent, 'timestamp'>) => consent?.[category] === true,
    [consent]
  );

  return (
    <CookieContext.Provider value={{ consent, showBanner, acceptAll, essentialsOnly, saveSelection, hasConsent }}>
      {children}
    </CookieContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieContext);
  if (!ctx) throw new Error('useCookieConsent must be used within CookieProvider');
  return ctx;
}
