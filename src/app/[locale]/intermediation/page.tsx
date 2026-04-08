'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/components/ui/Toast';
import type { InquiryFormData } from '@/lib/zodSchemas';

function ViennaChecklist() {
  const t = useTranslations('intermediation');
  const listRef = useRef<HTMLUListElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    if (listRef.current) obs.observe(listRef.current);
    return () => obs.disconnect();
  }, []);

  const items = ['vc1','vc2','vc3','vc4','vc5','vc6','vc7'] as const;

  return (
    <ul ref={listRef} className="list-none" role="list" aria-label={t('checklistTitle')}>
      {items.map((key, i) => (
        <li
          key={key}
          className={`checklist-item grid grid-cols-[40px_1fr] items-start py-4 border-b border-border-subtle last:border-0 ${visible ? 'visible' : ''}`}
          style={{ transitionDelay: `${i * 60}ms` }}
          role="listitem"
        >
          <div className="w-5.5 h-5.5 border border-gold-dark bg-gold-xsubtle flex items-center justify-center mt-0.5 flex-shrink-0">
            <svg className="w-2.5 h-2.5 stroke-gold fill-none" viewBox="0 0 10 8" aria-hidden="true">
              <polyline points="1,4 4,7 9,1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm text-text-secondary leading-snug pt-0.5">{t(key)}</span>
        </li>
      ))}
    </ul>
  );
}

function InquiryForm() {
  const t = useTranslations('intermediation');
  const f = useTranslations('form');
  const toast = useToast();

  const [fields, setFields] = useState<Partial<InquiryFormData & { honeypot: string }>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function set(key: string, value: string | boolean) {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!fields.name?.trim()) e.name = f('required');
    if (!fields.company?.trim()) e.company = f('required');
    if (!fields.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Valid email required';
    if (!fields.role) e.role = f('required');
    if (!fields.commodityCategory) e.commodityCategory = f('required');
    if (!fields.description?.trim() || fields.description.length < 20) e.description = 'Min. 20 characters';
    if (!fields.ndaConsent) e.ndaConsent = 'NDA consent required';
    if (!fields.complianceConsent) e.complianceConsent = 'Compliance confirmation required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) { toast.error('Please fill in all required fields correctly.'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        toast.success(f('success'));
      } else {
        toast.error(data.message ?? f('error'));
      }
    } catch {
      toast.error(f('error'));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-success-bg border border-success p-6 text-sm text-success leading-relaxed">
        <strong className="block mb-2 font-bold">✓ {f('success')}</strong>
        <p className="text-text-secondary text-xs">{f('ndaNote')}</p>
      </div>
    );
  }

  const inputCls = (k: string) =>
    `form-input ${errors[k] ? 'border-error' : ''}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="relative">
      {/* Honeypot */}
      <input
        type="text" name="honeypot" className="absolute -left-full opacity-0 pointer-events-none"
        tabIndex={-1} autoComplete="off" aria-hidden="true"
        onChange={(e) => set('honeypot', e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Name */}
        <div>
          <label htmlFor="vtd-name" className="form-label">{f('name')} <span className="text-gold">*</span></label>
          <input id="vtd-name" type="text" className={inputCls('name')} placeholder={f('namePlaceholder')} autoComplete="name"
            onChange={(e) => set('name', e.target.value)}/>
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>
        {/* Company */}
        <div>
          <label htmlFor="vtd-company" className="form-label">{f('company')} <span className="text-gold">*</span></label>
          <input id="vtd-company" type="text" className={inputCls('company')} placeholder={f('companyPlaceholder')} autoComplete="organization"
            onChange={(e) => set('company', e.target.value)}/>
          {errors.company && <p className="form-error">{errors.company}</p>}
        </div>
        {/* Email */}
        <div>
          <label htmlFor="vtd-email" className="form-label">{f('email')} <span className="text-gold">*</span></label>
          <input id="vtd-email" type="email" className={inputCls('email')} placeholder={f('emailPlaceholder')} autoComplete="email"
            onChange={(e) => set('email', e.target.value)}/>
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>
        {/* Phone */}
        <div>
          <label htmlFor="vtd-phone" className="form-label">{f('phone')}</label>
          <input id="vtd-phone" type="tel" className="form-input" placeholder={f('phonePlaceholder')} autoComplete="tel"
            onChange={(e) => set('phone', e.target.value)}/>
        </div>
        {/* Role */}
        <div>
          <label htmlFor="vtd-role" className="form-label">{f('role')} <span className="text-gold">*</span></label>
          <select id="vtd-role" className={inputCls('role')} onChange={(e) => set('role', e.target.value)} defaultValue="">
            <option value="" disabled>{f('required')}</option>
            <option value="seller">{f('roleSeller')}</option>
            <option value="buyer">{f('roleBuyer')}</option>
            <option value="broker">{f('roleBroker')}</option>
            <option value="other">{f('roleOther')}</option>
          </select>
          {errors.role && <p className="form-error">{errors.role}</p>}
        </div>
        {/* Commodity */}
        <div>
          <label htmlFor="vtd-commodity" className="form-label">{f('commodity')}</label>
          <select id="vtd-commodity" className="form-input" onChange={(e) => set('commodityCategory', e.target.value)} defaultValue="">
            <option value="" disabled>{f('required')}</option>
            <option value="metals">{f('commodityMetals')}</option>
            <option value="energy">{f('commodityEnergy')}</option>
            <option value="agriculture">{f('commodityAgri')}</option>
          </select>
          {errors.commodityCategory && <p className="form-error">{errors.commodityCategory}</p>}
        </div>
        {/* Quantity */}
        <div>
          <label htmlFor="vtd-qty" className="form-label">{f('quantity')}</label>
          <input id="vtd-qty" type="text" className="form-input" placeholder={f('quantityPlaceholder')}
            onChange={(e) => set('quantity', e.target.value)}/>
        </div>
        {/* Incoterm */}
        <div>
          <label htmlFor="vtd-inco" className="form-label">{f('incoterm')}</label>
          <input id="vtd-inco" type="text" className="form-input" placeholder={f('incotermPlaceholder')}
            onChange={(e) => set('incoterm', e.target.value)}/>
        </div>
        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="vtd-desc" className="form-label">{f('description')} <span className="text-gold">*</span></label>
          <textarea id="vtd-desc" className={`${inputCls('description')} resize-y min-h-[90px]`}
            placeholder={f('descriptionPlaceholder')} rows={4}
            onChange={(e) => set('description', e.target.value)}/>
          {errors.description && <p className="form-error">{errors.description}</p>}
        </div>
        {/* NDA consent */}
        <div className="md:col-span-2 bg-warning-bg border border-warning/20 p-4">
          <label className="grid grid-cols-[22px_1fr] gap-3 items-start cursor-pointer">
            <input type="checkbox" className="mt-0.5 accent-gold" onChange={(e) => set('ndaConsent', e.target.checked)}/>
            <span className="text-xs text-text-secondary leading-relaxed">
              {f('ndaConsent')}
            </span>
          </label>
          {errors.ndaConsent && <p className="form-error mt-1">{errors.ndaConsent}</p>}
        </div>
        {/* Compliance */}
        <div className="md:col-span-2 bg-warning-bg border border-warning/20 p-4">
          <label className="grid grid-cols-[22px_1fr] gap-3 items-start cursor-pointer">
            <input type="checkbox" className="mt-0.5 accent-gold" onChange={(e) => set('complianceConsent', e.target.checked)}/>
            <span className="text-xs text-text-secondary leading-relaxed">
              <strong className="text-warning font-bold">Keine Finanzdienstleistungen i.S.d. BWG/WAG 2018.</strong>{' '}
              {f('complianceConsent')}
            </span>
          </label>
          {errors.complianceConsent && <p className="form-error mt-1">{errors.complianceConsent}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap mt-4">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {submitting && (
            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="32" strokeLinecap="round"/>
            </svg>
          )}
          {submitting ? f('submitting') : f('submit')}
        </button>
        <span className="text-xs text-text-tertiary">{f('ndaNote')}</span>
      </div>
    </form>
  );
}

export default function IntermediationPage() {
  const t = useTranslations('intermediation');

  const steps = [
    { num: '01', titleKey: 'step1Title', descKey: 'step1Desc' },
    { num: '02', titleKey: 'step2Title', descKey: 'step2Desc' },
    { num: '03', titleKey: 'step3Title', descKey: 'step3Desc' },
    { num: '04', titleKey: 'step4Title', descKey: 'step4Desc' },
    { num: '05', titleKey: 'step5Title', descKey: 'step5Desc' },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="px-4 md:px-12 py-20">
        <div className="section-eyebrow">{t('eyebrow')}</div>
        <h1 className="section-title">{t('title')}</h1>

        {/* Legal warning */}
        <div className="flex items-start gap-3 bg-warning-bg border border-warning/25 p-4 mb-10 max-w-4xl" role="note">
          <svg className="flex-shrink-0 w-4 h-4 stroke-warning fill-none mt-0.5" viewBox="0 0 16 16">
            <path d="M8 1.5L14.5 13H1.5L8 1.5z" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M8 6.5v3.5M8 11.5v.5" strokeLinecap="round" strokeWidth="1.5"/>
          </svg>
          <p className="text-sm text-text-secondary leading-relaxed">
            <strong className="text-warning font-bold">Wichtiger rechtlicher Hinweis: </strong>
            {t('legalWarning')}{' '}
            <strong className="text-warning">{t('legalHighlight')}</strong>
            {t('legalEnd')}
          </p>
        </div>

        <p className="text-base leading-relaxed text-text-secondary max-w-3xl mb-12 pl-5 border-l-2 border-gold-dark">
          {t('lead')}
        </p>

        {/* 5-step process */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-border-default border border-border-default mb-12" role="list" aria-label="Intermediation process">
          {steps.map(({ num, titleKey, descKey }) => (
            <div key={num} className="bg-ink-4 p-6" role="listitem">
              <div className="font-mono text-3xl font-light text-gold-dark leading-none mb-3">{num}</div>
              <div className="text-sm font-bold text-text-primary mb-2">{t(titleKey)}</div>
              <p className="text-xs leading-relaxed text-text-secondary">{t(descKey)}</p>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border-default border border-border-default mb-16">
          {[
            { icon: '🔒', titleKey: 'step1Title' as const, descDE: 'Alle Anfragen unter unterzeichnetem NDA ab dem ersten Kontakt. Informationen werden ohne ausdrückliche schriftliche Zustimmung niemals weitergegeben.', descEN: 'All inquiries under signed NDA from the first contact. Information is never shared without explicit written consent.', descES: 'Todas las consultas bajo NDA firmado desde el primer contacto. La información nunca se comparte sin consentimiento escrito explícito.' },
            { icon: '✅', titleKey: 'step2Title' as const, descDE: 'KYC/AML-Compliance nach österreichischem Recht und Kapazitätsverifizierung vor jeder Vermittlung.', descEN: 'KYC/AML compliance under Austrian law and capacity verification before any introduction.', descES: 'Cumplimiento KYC/AML bajo ley austriaca y verificación de capacidad antes de cualquier presentación.' },
            { icon: '📄', titleKey: 'step4Title' as const, descDE: 'NCNDA, IMFPA, LOI, SPA-Entwurf und Provisionsschutz — in Kooperation mit Wiener Rechtsanwaltskanzleien.', descEN: 'NCNDA, IMFPA, LOI, SPA draft and commission protection — in cooperation with Vienna law firms.', descES: 'NCNDA, IMFPA, LOI, borrador de SPA y protección de comisiones — en cooperación con despachos de abogados vieneses.' },
          ].map(({ icon, titleKey, descDE, descEN, descES }) => {
            const tabLabel = t('eyebrow');
            const locale = tabLabel.includes('Ergänzende') ? 'de' : tabLabel.includes('Complementario') ? 'es' : 'en';
            const desc = locale === 'de' ? descDE : locale === 'es' ? descES : descEN;
            return (
              <div key={titleKey} className="bg-ink-2 p-8 hover:bg-ink-3 transition-colors duration-fast">
                <div className="text-3xl mb-4" aria-hidden="true">{icon}</div>
                <h3 className="font-display text-xl font-400 text-text-primary mb-2">{t(titleKey)}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vienna Closing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-b border-border-default">
        <div className="bg-ink-4 px-4 md:px-12 py-12 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-border-default">
          <div className="absolute bottom-[-24px] right-[-12px] font-display text-[110px] font-light text-gold/[0.04] leading-none pointer-events-none select-none" aria-hidden="true">WIEN</div>
          <span className="text-xs font-bold tracking-ultra uppercase text-gold block mb-6">{t('viennaSubtitle')}</span>
          <h2 className="font-display font-light text-text-primary mb-6" style={{ fontSize: 'clamp(28px,2.8vw,44px)', lineHeight: 1.1 }} id="vienna-title">
            {t('viennaTitle')}
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary mb-3">{t('viennaDesc1')}</p>
          <p className="text-sm leading-relaxed text-text-secondary">{t('viennaDesc2')}</p>
        </div>
        <div className="bg-ink-2 px-4 md:px-12 py-12">
          <h3 className="text-xs font-bold tracking-ultra uppercase text-gold mb-6">{t('checklistTitle')}</h3>
          <ViennaChecklist />
        </div>
      </div>

      {/* Inquiry form */}
      <div className="bg-ink-3 border-b border-border-default px-4 md:px-12 py-12">
        <h2 className="font-display text-2xl font-light text-text-primary mb-2">{t('formTitle')}</h2>
        <p className="text-sm text-text-secondary mb-6">{t('formSubtitle')}</p>
        <InquiryForm />
      </div>
    </div>
  );
}
