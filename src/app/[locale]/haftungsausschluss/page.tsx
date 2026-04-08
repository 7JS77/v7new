import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';

export default async function HaftungsausschlussPage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'legal' });
  const isDE = locale === 'de';
  const isES = locale === 'es';
  return (
    <div className="px-4 md:px-12 py-20 max-w-3xl mx-auto">
      <h1 className="font-display text-4xl font-light text-text-primary mb-2">{t('haftungsausschlussTitle')}</h1>
      <p className="font-mono text-xs text-text-tertiary mb-10">Aurexon GmbH · 2025</p>
      <h2 className="font-display text-2xl font-light text-text-primary mb-3">1. {isDE ? 'Ausschluss von Finanzdienstleistungen' : isES ? 'Exclusión de servicios financieros' : 'Exclusion of financial services'}</h2>
      <div className="bg-ink-3 border border-border-default p-5 mb-6 text-sm text-text-secondary leading-relaxed space-y-1">
        <p className="font-bold text-gold mb-2">{isDE ? 'Aurexon GmbH erbringt ausdrücklich KEINE Finanzdienstleistungen i.S.d.:' : isES ? 'Aurexon GmbH NO proporciona servicios financieros según:' : 'Aurexon GmbH explicitly provides NO financial services per:'}</p>
        {['Bankwesengesetz (BWG)', 'Wertpapieraufsichtsgesetz 2018 (WAG 2018) / MiFID II', 'Zahlungsdienstegesetz (ZaDiG)', 'Alternative Investmentfonds Manager-Gesetz (AIFMG)'].map((item) => (
          <p key={item} className="pl-4">· {item}</p>
        ))}
      </div>
      <h2 className="font-display text-2xl font-light text-text-primary mb-3 mt-6">2. {isDE ? 'Marktdaten und Preisinformationen' : isES ? 'Datos de mercado e información de precios' : 'Market data and price information'}</h2>
      <p className="text-sm text-text-secondary leading-relaxed mb-4">
        {isDE ? 'Alle angezeigten Preise und Marktdaten stammen aus öffentlich verfügbaren, lizenzfreien Quellen. Diese Daten sind:' : isES ? 'Todos los precios y datos de mercado mostrados provienen de fuentes públicas libres de derechos. Estos datos son:' : 'All displayed prices and market data are sourced from publicly available, license-free sources. This data is:'}
      </p>
      <ul className="list-disc list-inside text-sm text-text-secondary space-y-1 mb-6">
        {(isDE
          ? ['Unverbindlich — kein Angebot zum Kauf oder Verkauf','Nur Informationszwecke — keine Anlageempfehlung i.S.d. WAG 2018','Möglicherweise verzögert oder unvollständig']
          : isES
          ? ['No vinculantes — sin oferta de compra o venta','Solo informativos — sin asesoramiento de inversión según WAG 2018','Posiblemente retrasados o incompletos']
          : ['Non-binding — no offer to buy or sell','Informational only — no investment advice per WAG 2018','Potentially delayed or incomplete']
        ).map((item) => <li key={item} className="leading-relaxed">{item}</li>)}
      </ul>
      <p className="text-sm font-bold text-text-primary mb-6">
        {isDE ? 'Verbindliche Preise entstehen ausschließlich durch schriftlichen Kaufvertrag (SPA).' : isES ? 'Los precios vinculantes surgen exclusivamente de un contrato de compraventa escrito (SPA).' : 'Binding prices arise exclusively from a written purchase agreement (SPA).'}
      </p>
      <h2 className="font-display text-2xl font-light text-text-primary mb-3 mt-6">3. {isDE ? 'Anwendbares Recht' : isES ? 'Ley aplicable' : 'Applicable Law'}</h2>
      <p className="text-sm text-text-secondary">
        {isDE ? 'Österreichisches Recht. Gerichtsstand: Wien, Österreich.' : isES ? 'Ley austriaca. Jurisdicción: Viena, Austria.' : 'Austrian law. Jurisdiction: Vienna, Austria.'}
      </p>
    </div>
  );
}
