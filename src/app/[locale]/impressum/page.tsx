import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';

export default async function ImpressumPage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'legal' });
  const isDE = locale === 'de';
  const isES = locale === 'es';
  return (
    <div className="px-4 md:px-12 py-20 max-w-3xl mx-auto">
      <h1 className="font-display text-4xl font-light text-text-primary mb-2">{t('impressumTitle')}</h1>
      <p className="font-mono text-xs text-text-tertiary mb-10">Aurexon GmbH · {isDE ? 'Gemäß § 5 ECG und § 14 UGB' : isES ? 'Según § 5 ECG y § 14 UGB' : 'Pursuant to § 5 ECG and § 14 UGB'} · 2025</p>
      <div className="bg-ink-3 border border-border-default p-6 mb-6 text-sm text-text-secondary leading-relaxed space-y-1">
        <p><strong className="text-gold">{isDE ? 'Firma:' : isES ? 'Empresa:' : 'Company:'}</strong> Aurexon GmbH</p>
        <p><strong className="text-gold">{isDE ? 'Rechtsform:' : isES ? 'Forma jurídica:' : 'Legal form:'}</strong> {isDE ? 'Gesellschaft mit beschränkter Haftung (GmbH)' : isES ? 'Sociedad de Responsabilidad Limitada (GmbH)' : 'Limited Liability Company (GmbH)'}</p>
        <p><strong className="text-gold">{isDE ? 'Sitz:' : isES ? 'Domicilio:' : 'Registered office:'}</strong> Wien, Österreich</p>
        <p><strong className="text-gold">{isDE ? 'Straße:' : isES ? 'Calle:' : 'Address:'}</strong> [Tatsächliche Adresse / Actual Address]</p>
        <p><strong className="text-gold">PLZ, Ort:</strong> 1010 Wien</p>
        <p><strong className="text-gold">{isDE ? 'Firmenbuchnummer:' : isES ? 'Número de registro:' : 'Company register no.:'}</strong> FN [Platzhalter] beim Handelsgericht Wien</p>
        <p><strong className="text-gold">UID-Nummer:</strong> ATU [Platzhalter]</p>
        <p><strong className="text-gold">{isDE ? 'Geschäftsführung:' : isES ? 'Dirección:' : 'Managing Director:'}</strong> [Name des Geschäftsführers]</p>
        <p><strong className="text-gold">{isDE ? 'Unternehmensgegenstand:' : isES ? 'Objeto social:' : 'Business purpose:'}</strong> {isDE ? 'Handel mit Waren aller Art' : isES ? 'Comercio de mercancías de todo tipo' : 'Trading in goods of all kinds'}</p>
        <p><strong className="text-gold">{isDE ? 'Gewerbeberechtigung:' : isES ? 'Licencia comercial:' : 'Trade licence:'}</strong> {isDE ? 'gemäß Gewerbeordnung 1994 (GewO)' : isES ? 'según Ley de Comercio 1994 (GewO)' : 'pursuant to Trade Act 1994 (GewO)'}</p>
        <p><strong className="text-gold">{isDE ? 'Mitgliedschaft:' : isES ? 'Membresía:' : 'Membership:'}</strong> Wirtschaftskammer Wien (WKÖ), {isDE ? 'Sparte Handel' : isES ? 'División de Comercio' : 'Trade Division'}</p>
        <p><strong className="text-gold">E-Mail:</strong> office@aurexon.at</p>
        <p><strong className="text-gold">{isDE ? 'Telefon:' : isES ? 'Teléfono:' : 'Phone:'}</strong> +43 1 000 0000</p>
      </div>
      <h2 className="font-display text-2xl font-light text-text-primary mb-3 mt-8">{isDE ? 'Haftungsausschluss' : isES ? 'Descargo de responsabilidad' : 'Disclaimer'}</h2>
      <p className="text-sm leading-relaxed text-text-secondary mb-4">
        <strong className="text-gold">{isDE ? 'Keine Finanzdienstleistungen:' : isES ? 'Sin servicios financieros:' : 'No financial services:'}</strong>{' '}
        {isDE ? 'Aurexon GmbH ist kein Kreditinstitut i.S.d. BWG und kein Wertpapierdienstleistungsunternehmen i.S.d. WAG 2018. Aurexon GmbH erbringt keine Finanzdienstleistungen.' : isES ? 'Aurexon GmbH no es una entidad de crédito en el sentido de la BWG ni una empresa de servicios de inversión en el sentido de la WAG 2018.' : 'Aurexon GmbH is not a credit institution per BWG and not a securities services company per WAG 2018. Aurexon GmbH does not provide financial services.'}
      </p>
      <h2 className="font-display text-2xl font-light text-text-primary mb-3 mt-8">{isDE ? 'Anwendbares Recht' : isES ? 'Ley aplicable' : 'Applicable Law'}</h2>
      <p className="text-sm leading-relaxed text-text-secondary">
        {isDE ? 'Es gilt ausschließlich österreichisches Recht unter Ausschluss des UN-Kaufrechts (CISG). Gerichtsstand: Wien, Österreich.' : isES ? 'Se aplica exclusivamente la ley austriaca con exclusión de la Convención de Viena (CISG). Jurisdicción: Viena, Austria.' : 'Austrian law applies exclusively, excluding the UN Convention on Contracts (CISG). Jurisdiction: Vienna, Austria.'}
      </p>
    </div>
  );
}
