import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';

export default async function DatenschutzPage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'legal' });
  const isDE = locale === 'de';
  const isES = locale === 'es';
  return (
    <div className="px-4 md:px-12 py-20 max-w-3xl mx-auto">
      <h1 className="font-display text-4xl font-light text-text-primary mb-2">{t('datenschutzTitle')}</h1>
      <p className="font-mono text-xs text-text-tertiary mb-10">Aurexon GmbH · {isDE ? 'Gemäß Art. 13-14 DSGVO und DSG' : isES ? 'Según Art. 13-14 RGPD y DSG' : 'Pursuant to Art. 13-14 GDPR and DSG'} · 2025</p>
      <h2 className="font-display text-2xl font-light text-text-primary mb-3">1. {isDE ? 'Verantwortlicher' : isES ? 'Responsable' : 'Controller'}</h2>
      <div className="bg-ink-3 border border-border-default p-5 mb-6 text-sm text-text-secondary leading-relaxed">
        Aurexon GmbH · Wien, Österreich · FN [Platzhalter]<br/>E-Mail: office@aurexon.at · Tel: +43 1 000 0000
      </div>
      <h2 className="font-display text-2xl font-light text-text-primary mb-3 mt-6">2. {isDE ? 'Erhobene Daten und Zwecke' : isES ? 'Datos recopilados y finalidades' : 'Data collected and purposes'}</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-ink-4">
              {[isDE ? 'Datenkategorie' : isES ? 'Categoría de datos' : 'Data category', isDE ? 'Zweck' : isES ? 'Finalidad' : 'Purpose', isDE ? 'Rechtsgrundlage' : isES ? 'Base jurídica' : 'Legal basis', isDE ? 'Speicherdauer' : isES ? 'Período de conservación' : 'Retention'].map((h) => (
                <th key={h} className="text-left px-3 py-2 text-text-primary font-bold tracking-wider border border-border-subtle">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              [isDE ? 'Kontaktdaten' : isES ? 'Datos de contacto' : 'Contact data', isDE ? 'Bearbeitung von Anfragen' : isES ? 'Gestión de consultas' : 'Processing enquiries', 'Art. 6 Abs. 1 lit. b DSGVO', isDE ? '3 Jahre' : isES ? '3 años' : '3 years'],
              [isDE ? 'Firmen-/Transaktionsdaten' : isES ? 'Datos de empresa/transacción' : 'Company/transaction data', isDE ? 'Eigenhandel / SPA' : isES ? 'Comercio propio / SPA' : 'Proprietary trading / SPA', 'Art. 6 Abs. 1 lit. b DSGVO', isDE ? '7 Jahre (§ 212 UGB)' : isES ? '7 años' : '7 years'],
              [isDE ? 'KYC/AML-Daten' : isES ? 'Datos KYC/AML' : 'KYC/AML data', isDE ? 'Gesetzliche Sorgfaltspflichten' : isES ? 'Debida diligencia legal' : 'Legal due diligence', 'Art. 6 Abs. 1 lit. c DSGVO', isDE ? '5 Jahre nach Geschäftsende' : isES ? '5 años tras fin del negocio' : '5 years after end of business'],
              [isDE ? 'Server-Logs' : isES ? 'Registros del servidor' : 'Server logs', isDE ? 'IT-Sicherheit' : isES ? 'Seguridad informática' : 'IT security', 'Art. 6 Abs. 1 lit. f DSGVO', isDE ? '90 Tage' : isES ? '90 días' : '90 days'],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2 text-text-secondary border border-border-subtle">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="font-display text-2xl font-light text-text-primary mb-3 mt-6">3. {isDE ? 'Ihre Rechte' : isES ? 'Sus derechos' : 'Your rights'}</h2>
      <ul className="list-disc list-inside text-sm text-text-secondary space-y-1 mb-6">
        {(isDE
          ? ['Auskunft (Art. 15 DSGVO)','Berichtigung (Art. 16 DSGVO)','Löschung (Art. 17 DSGVO)','Einschränkung (Art. 18 DSGVO)','Datenübertragbarkeit (Art. 20 DSGVO)','Widerspruch (Art. 21 DSGVO)']
          : isES
          ? ['Acceso (Art. 15 RGPD)','Rectificación (Art. 16 RGPD)','Supresión (Art. 17 RGPD)','Limitación (Art. 18 RGPD)','Portabilidad (Art. 20 RGPD)','Oposición (Art. 21 RGPD)']
          : ['Access (Art. 15 GDPR)','Rectification (Art. 16 GDPR)','Erasure (Art. 17 GDPR)','Restriction (Art. 18 GDPR)','Portability (Art. 20 GDPR)','Objection (Art. 21 GDPR)']
        ).map((r) => <li key={r} className="leading-relaxed">{r}</li>)}
      </ul>
      <h2 className="font-display text-2xl font-light text-text-primary mb-3 mt-6">4. {isDE ? 'Beschwerderecht' : isES ? 'Derecho de reclamación' : 'Right to lodge a complaint'}</h2>
      <p className="text-sm text-text-secondary leading-relaxed">
        {isDE ? 'Österreichische Datenschutzbehörde (DSB): Barichgasse 40-42, 1030 Wien · dsb@dsb.gv.at' : isES ? 'Autoridad Austriaca de Protección de Datos (DSB): Barichgasse 40-42, 1030 Viena · dsb@dsb.gv.at' : 'Austrian Data Protection Authority (DSB): Barichgasse 40-42, 1030 Vienna · dsb@dsb.gv.at'}
      </p>
    </div>
  );
}
