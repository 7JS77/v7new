'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/components/ui/Toast';

function ContactForm() {
  const t = useTranslations('form');
  const toast = useToast();
  const [fields, setFields] = useState<Record<string, string | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function set(key: string, value: string | boolean) {
    setFields((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!fields.name?.toString().trim()) e.name = t('required');
    if (!fields.email?.toString().trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email as string)) e.email = t('required');
    if (!fields.subject) e.subject = t('required');
    if (!fields.message?.toString().trim()) e.message = t('required');
    if (!fields.privacyConsent) e.privacyConsent = t('required');
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (data.success) { setSubmitted(true); toast.success(t('contactSuccess')); }
      else toast.error(data.message ?? t('contactError'));
    } catch { toast.error(t('contactError')); }
    finally { setSubmitting(false); }
  }

  if (submitted) {
    return (
      <div className="bg-success-bg border border-success p-6 text-sm text-success">
        <strong className="block mb-1">✓ {t('contactSuccess')}</strong>
      </div>
    );
  }

  const inp = (k: string) => `form-input ${errors[k] ? 'border-error' : ''}`;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input type="text" name="honeypot" className="absolute -left-full opacity-0 pointer-events-none" tabIndex={-1} autoComplete="off" aria-hidden="true" onChange={(e) => set('honeypot', e.target.value)}/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor="c-name" className="form-label">{t('name')} <span className="text-gold">*</span></label>
          <input id="c-name" type="text" className={inp('name')} placeholder={t('namePlaceholder')} autoComplete="name" onChange={(e) => set('name', e.target.value)}/>
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="c-email" className="form-label">{t('email')} <span className="text-gold">*</span></label>
          <input id="c-email" type="email" className={inp('email')} placeholder={t('emailPlaceholder')} autoComplete="email" onChange={(e) => set('email', e.target.value)}/>
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="c-company" className="form-label">{t('company')}</label>
          <input id="c-company" type="text" className="form-input" placeholder={t('companyPlaceholder')} autoComplete="organization" onChange={(e) => set('company', e.target.value)}/>
        </div>
        <div>
          <label htmlFor="c-subject" className="form-label">{t('subject')} <span className="text-gold">*</span></label>
          <select id="c-subject" className={inp('subject')} defaultValue="" onChange={(e) => set('subject', e.target.value)}>
            <option value="" disabled>{t('subjectPlaceholder')}</option>
            <option value="intermediation">{t('subjectIntermediation')}</option>
            <option value="trading">{t('subjectTrading')}</option>
            <option value="information">{t('subjectInformation')}</option>
            <option value="general">{t('subjectGeneral')}</option>
          </select>
          {errors.subject && <p className="form-error">{errors.subject}</p>}
        </div>
        <div className="md:col-span-2">
          <label htmlFor="c-message" className="form-label">{t('message')} <span className="text-gold">*</span></label>
          <textarea id="c-message" className={`${inp('message')} resize-y min-h-[90px]`} placeholder={t('messagePlaceholder')} rows={5} onChange={(e) => set('message', e.target.value)}/>
          {errors.message && <p className="form-error">{errors.message}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="grid grid-cols-[20px_1fr] gap-3 items-start cursor-pointer">
            <input type="checkbox" className="mt-0.5 accent-gold" onChange={(e) => set('privacyConsent', e.target.checked)}/>
            <span className="text-xs text-text-secondary leading-relaxed">
              {t('privacyConsent')}{' '}
              <a href="datenschutz" className="text-gold underline hover:text-gold-light">{t('privacyLink')}</a>
              {t('privacyEnd')}
              <span className="text-gold ml-1">*</span>
            </span>
          </label>
          {errors.privacyConsent && <p className="form-error">{errors.privacyConsent}</p>}
        </div>
      </div>
      <button type="submit" disabled={submitting} className="btn-primary mt-4 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
        {submitting && <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="32" strokeLinecap="round"/></svg>}
        {submitting ? t('submitting') : t('contactSubmit')}
      </button>
    </form>
  );
}

export default function ContactPage() {
  const t = useTranslations('contact');

  const officeInfo = [
    { icon: (
      <svg className="w-4 h-4 stroke-gold fill-none flex-shrink-0 mt-0.5" viewBox="0 0 18 18">
        <path d="M9 2a5 5 0 0 1 5 5c0 3.5-5 9-5 9S4 10.5 4 7a5 5 0 0 1 5-5z" strokeWidth="1.4"/>
        <circle cx="9" cy="7" r="1.8" strokeWidth="1.4"/>
      </svg>
    ), label: t('addressLabel'), value: t('addressValue') },
    { icon: (
      <svg className="w-4 h-4 stroke-gold fill-none flex-shrink-0 mt-0.5" viewBox="0 0 18 18">
        <path d="M3 4h12v10H3zM3 4l6 5 6-5" strokeWidth="1.4"/>
      </svg>
    ), label: t('emailLabel'), value: 'office@aurexon.at' },
    { icon: (
      <svg className="w-4 h-4 stroke-gold fill-none flex-shrink-0 mt-0.5" viewBox="0 0 18 18">
        <path d="M4 2h3l1.5 4-2 1.5a9 9 0 0 0 4 4l1.5-2L16 11v3a2 2 0 0 1-2 2A14 14 0 0 1 2 4a2 2 0 0 1 2-2z" strokeWidth="1.4"/>
      </svg>
    ), label: t('phoneLabel'), value: '+43 1 000 0000', sub: t('phoneHours') },
    { icon: (
      <svg className="w-4 h-4 stroke-gold fill-none flex-shrink-0 mt-0.5" viewBox="0 0 18 18">
        <circle cx="9" cy="9" r="7" strokeWidth="1.4"/>
        <path d="M9 5v4l3 2" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ), label: t('deskLabel'), value: <span className="text-success">● {t('deskStatus')}</span> },
  ];

  return (
    <div className="px-4 md:px-12 py-20 max-w-7xl mx-auto">
      <div className="section-eyebrow">{t('eyebrow')}</div>
      <h1 className="section-title">{t('title')}</h1>
      <p className="section-subtitle">{t('subtitle')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border-default border border-border-default">
        {/* Left: office info */}
        <div className="bg-ink-2 p-10 lg:p-12">
          <h2 className="font-display text-2xl font-light text-text-primary mb-4">{t('officeTitle')}</h2>
          <p className="text-sm leading-relaxed text-text-secondary mb-8">{t('officeBody')}</p>

          <div className="flex flex-col gap-4 mb-8">
            {officeInfo.map(({ icon, label, value, sub }) => (
              <div key={label} className="flex items-start gap-3">
                {icon}
                <div>
                  <div className="text-xs font-bold tracking-wider uppercase text-text-tertiary mb-0.5">{label}</div>
                  <div className="text-sm text-text-secondary">{value}</div>
                  {sub && <div className="text-xs text-text-tertiary mt-0.5">{sub}</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-text-tertiary px-4 py-3 bg-ink-4 border-l-2 border-border-default leading-relaxed">
            {t('legalNote')}
          </div>
        </div>

        {/* Right: form */}
        <div className="bg-ink-3 p-10 lg:p-12 relative">
          <h2 className="font-display text-xl font-light text-text-primary mb-6">{t('formTitle')}</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
