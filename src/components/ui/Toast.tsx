'use client';

import React, { createContext, useContext, useCallback, useState, useRef, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  exiting?: boolean;
}

interface ToastContextValue {
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastType, React.ReactNode> = {
  success: (
    <svg className="w-4 h-4 flex-shrink-0 text-success" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" fill="none" strokeWidth="1.5"/>
      <path d="M6 10l3 3 5-6" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg className="w-4 h-4 flex-shrink-0 text-error" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" fill="none" strokeWidth="1.5"/>
      <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4 flex-shrink-0 text-warning" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 2L1 18h18L10 2z" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M10 8v4M10 14v1" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg className="w-4 h-4 flex-shrink-0 text-info" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" fill="none" strokeWidth="1.5"/>
      <path d="M10 9v5M10 6v1" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

const BORDER_COLORS: Record<ToastType, string> = {
  success: 'border-l-success',
  error: 'border-l-error',
  warning: 'border-l-warning',
  info: 'border-l-info',
};

function ToastItem({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  useEffect(() => {
    if (!item.duration) return;
    const t = setTimeout(() => onDismiss(item.id), item.duration);
    return () => clearTimeout(t);
  }, [item.id, item.duration, onDismiss]);

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 bg-ink-3 border border-border-default border-l-4 ${BORDER_COLORS[item.type]} p-4 min-w-72 max-w-md shadow-lg ${item.exiting ? 'toast-exit' : 'toast-enter'}`}
    >
      {ICONS[item.type]}
      <div className="flex-1">
        {item.title && <div className="text-sm font-bold text-text-primary mb-0.5">{item.title}</div>}
        <div className="text-sm text-text-secondary leading-snug">{item.message}</div>
      </div>
      <button
        onClick={() => onDismiss(item.id)}
        className="text-text-tertiary hover:text-text-primary transition-colors flex-shrink-0"
        aria-label="Close notification"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const add = useCallback((type: ToastType, message: string, title?: string, duration = 5000) => {
    const id = `toast-${++counterRef.current}`;
    setToasts((prev) => [...prev.slice(-4), { id, type, message, title, duration }]);
  }, []);

  const value: ToastContextValue = {
    success: (msg, title) => add('success', msg, title),
    error: (msg, title) => add('error', msg, title ?? 'Error', 8000),
    warning: (msg, title) => add('warning', msg, title),
    info: (msg, title) => add('info', msg, title),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        id="toast-container"
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem item={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
