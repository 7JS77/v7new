import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';

export default async function AGBPage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'legal' });
  const isDE = locale === 'de';
  const isES = locale === 'es';
  return (
    <div className="px-4 md:px-12 py-20 max-w-3xl mx-auto">
      <h1 className="font-display text-4xl font-light text-text-primary mb-2">{t('agbTitle')}</h1>
      <p className="font-mono text-xs text-text-tertiary mb-10">Aurexon GmbH, Wien · Version 1.0 · 2025</p>
      {[
        { num: '§ 1', titleDE: 'Geltungsbereich', titleEN: 'Scope', titleES: 'Ámbito de aplicación', bodyDE: 'Diese AGB gelten für alle Geschäftsbeziehungen zwischen der Aurexon GmbH und Unternehmen i.S.d. § 1 UGB. Eine Anwendung auf Verbraucher i.S.d. KSchG ist ausgeschlossen.', bodyEN: 'These T&Cs apply to all business relationships between Aurexon GmbH and companies within the meaning of § 1 UGB. Application to consumers per KSchG is excluded.', bodyES: 'Estas CGC se aplican a todas las relaciones comerciales entre Aurexon GmbH y empresas en el sentido del § 1 UGB. Se excluye la aplicación a consumidores.' },
        { num: '§ 2', titleDE: 'Vertragsschluss', titleEN: 'Contract formation', titleES: 'Formación del contrato', bodyDE: 'Angebote von Aurexon sind freibleibend und unverbindlich. Verbindliche Kaufverträge kommen erst durch schriftliche Auftragsbestätigung oder gesonderten SPA zustande.', bodyEN: 'Aurexon\'s offers are non-binding. Binding purchase contracts are concluded only through written order confirmation or a separate SPA.', bodyES: 'Las ofertas de Aurexon no son vinculantes. Los contratos de compraventa vinculantes solo se concluyen mediante confirmación de pedido escrita o un SPA separado.' },
        { num: '§ 3', titleDE: 'Haftung', titleEN: 'Liability', titleES: 'Responsabilidad', bodyDE: 'Haftung für leichte Fahrlässigkeit ausgeschlossen soweit gesetzlich zulässig. Haftung für mittelbare Schäden auf grobe Fahrlässigkeit und Vorsatz beschränkt.', bodyEN: 'Liability for slight negligence excluded to the extent permitted by law. Liability for indirect damages limited to gross negligence and intent.', bodyES: 'La responsabilidad por negligencia leve se excluye en la medida permitida por la ley. La responsabilidad por daños indirectos se limita a negligencia grave e intención.' },
        { num: '§ 4', titleDE: 'Anwendbares Recht', titleEN: 'Applicable law', titleES: 'Ley aplicable', bodyDE: 'Österreichisches Recht unter Ausschluss des CISG. Gerichtsstand: Handelsgericht Wien.', bodyEN: 'Austrian law, excluding CISG. Jurisdiction: Commercial Court Vienna.', bodyES: 'Ley austriaca, excluyendo el CISG. Jurisdicción: Tribunal Mercantil de Viena.' },
      ].map(({ num, titleDE, titleEN, titleES, bodyDE, bodyEN, bodyES }) => (
        <div key={num} className="mb-6">
          <h2 className="font-display text-2xl font-light text-text-primary mb-2">
            {num} {isDE ? titleDE : isES ? titleES : titleEN}
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            {isDE ? bodyDE : isES ? bodyES : bodyEN}
          </p>
        </div>
      ))}
    </div>
  );
}
