'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Tab = 'metals' | 'energy' | 'agriculture';

const COMMODITY_DATA = {
  metals: {
    stats: [
      { id: 'cs-gold',   val: '$2,345', label: 'Gold XAU/oz' },
      { id: 'cs-silver', val: '$28.15', label: 'Silver XAG/oz' },
      { id: 'cs-copper', val: '$9,820', label: 'LME Copper/t' },
      { id: 'cs-pd',     val: '$1,020', label: 'Palladium/oz' },
    ],
    items: [
      { icon: '🥇', nameDE: 'Gold (XAU)', nameEN: 'Gold (XAU)', nameES: 'Oro (XAU)', descDE: 'Physische Barren, LBMA-Standard, zugewiesene Lagerung, Kassa- und Termingeschäfte.', descEN: 'Physical bullion, LBMA-standard, allocated storage, spot and forward transactions.', descES: 'Lingotes físicos, estándar LBMA, almacenamiento asignado, transacciones a plazo.', price: '2,345.10 USD/oz' },
      { icon: '🥈', nameDE: 'Silber (XAG)', nameEN: 'Silver (XAG)', nameES: 'Plata (XAG)', descDE: 'Industrie- und Anlagesilber. Zertifizierte raffinierte Barren, physische Lieferung weltweit.', descEN: 'Industrial and investment silver. Certified refined bars, physical delivery worldwide.', descES: 'Plata industrial y de inversión. Barras refinadas certificadas, entrega física global.', price: '28.15 USD/oz' },
      { icon: '💎', nameDE: 'Platin & Palladium', nameEN: 'Platinum & Palladium', nameES: 'Platino y Paladio', descDE: 'PGMs für industrielle Nutzung. Zertifizierte südafrikanische und russische Raffinerien.', descEN: 'PGMs for industrial use. Certified South African and Russian refineries.', descES: 'PGMs para uso industrial. Refinerías certificadas sudafricanas y rusas.', price: 'Pt 965 · Pd 1,020 USD/oz' },
      { icon: '🔶', nameDE: 'LME Kupfer', nameEN: 'LME Copper', nameES: 'Cobre LME', descDE: 'Kupferkathoden Grad A und Walzdraht. LME-registrierte Warrants und Kassageschäfte.', descEN: 'Grade A copper cathodes and wire rod. LME-registered warrants and spot transactions.', descES: 'Cátodos de cobre grado A. Warrants registrados en LME y transacciones al contado.', price: '9,820.50 USD/t' },
      { icon: '⚙️', nameDE: 'Aluminium & Legierungen', nameEN: 'Aluminium & Alloys', nameES: 'Aluminio y Aleaciones', descDE: 'Primäre Barren, Bolzen und Legierungen. LME-Kontrakte und physische Abnahmevereinbarungen.', descEN: 'Primary ingots, billets and alloys. LME contracts and physical offtake agreements.', descES: 'Lingotes primarios, tochos y aleaciones. Contratos LME y acuerdos de suministro físico.', price: '2,540.00 USD/t' },
      { icon: '🔩', nameDE: 'Nickel · Zink · Blei', nameEN: 'Nickel · Zinc · Lead', nameES: 'Níquel · Zinc · Plomo', descDE: 'Vollständiges Basismetallspektrum. LME-gehandelt und physische OTC-Kassageschäfte.', descEN: 'Full base metals spectrum. LME-traded and physical OTC spot transactions.', descES: 'Espectro completo de metales base. LME y transacciones físicas OTC al contado.', price: 'Auf Anfrage / On Request' },
    ],
    disclaimerDE: 'Quelle: MetalpriceAPI (öffentlich) · Nur Informationszwecke · Keine Anlageempfehlung · Verbindliche Preise erst im Kaufvertrag',
    disclaimerEN: 'Source: MetalpriceAPI (public) · Informational only · No investment advice · Binding prices only in purchase contract',
    disclaimerES: 'Fuente: MetalpriceAPI (pública) · Solo informativo · Sin asesoramiento de inversión · Precios vinculantes solo en contrato de compra',
  },
  energy: {
    stats: [
      { id: 'brent', val: '$84.25', label: 'Brent Crude/bbl' },
      { id: 'wti',   val: '$79.80', label: 'WTI Crude/bbl' },
      { id: 'gas',   val: '€32.40', label: 'TTF Gas/MWh' },
      { id: 'eua',   val: '€18.40', label: 'EUA CO₂/t' },
    ],
    items: [
      { icon: '🛢️', nameDE: 'Brent Rohöl', nameEN: 'Brent Crude Oil', nameES: 'Petróleo Brent', descDE: 'Nordsee-Referenzsorte. Physische Frachttransaktionen, Lieferverträge und Kassahandel.', descEN: 'North Sea benchmark. Physical cargo transactions, supply agreements and spot trading.', descES: 'Referencia del Mar del Norte. Transacciones de cargamentos físicos y comercio al contado.', price: '84.25 USD/bbl' },
      { icon: '🛢️', nameDE: 'WTI Rohöl', nameEN: 'WTI Crude Oil', nameES: 'Petróleo WTI', descDE: 'US-Referenzrohöl. Pipeline- und Schiffstransport. Physische Abwicklung.', descEN: 'US benchmark crude. Pipeline and waterborne delivery. Physical settlement.', descES: 'Crudo de referencia de EE.UU. Entrega por oleoducto y marítima. Liquidación física.', price: '79.80 USD/bbl' },
      { icon: '🔥', nameDE: 'Erdgas & LNG', nameEN: 'Natural Gas & LNG', nameES: 'Gas Natural y GNL', descDE: 'TTF und NBP Kassa- und Terminhandel. LNG-Frachttransaktionen an europäischen Terminals.', descEN: 'TTF and NBP spot and forward trading. LNG cargo transactions at European terminals.', descES: 'Comercio spot y a plazo TTF y NBP. Transacciones de cargamentos GNL en terminales europeas.', price: '32.40 EUR/MWh' },
      { icon: '⛽', nameDE: 'Raffinierte Produkte', nameEN: 'Refined Products', nameES: 'Productos Refinados', descDE: 'Benzin, Diesel, Kerosin, Heizöl und Naphtha. Logistikkoordination inklusive.', descEN: 'Gasoline, diesel, jet fuel, fuel oil and naphtha. Logistics coordination included.', descES: 'Gasolina, diésel, combustible para aviación, fuel oil y nafta. Coordinación logística incluida.', price: 'Auf Anfrage / On Request' },
      { icon: '🌱', nameDE: 'CO₂-Zertifikate (EUA)', nameEN: 'Carbon Credits (EUA)', nameES: 'Créditos de Carbono (EUA)', descDE: 'EU-Emissionszertifikate (EUA) und CERs. Kassa- und Terminabwicklung.', descEN: 'EU Emissions Allowances (EUA) and CERs. Spot and forward settlement.', descES: 'Permisos de Emisión de la UE (EUA) y CER. Liquidación al contado y a plazo.', price: '18.40 EUR/t CO₂' },
      { icon: '⚡', nameDE: 'Strom & Erneuerbare', nameEN: 'Power & Renewables', nameES: 'Electricidad y Renovables', descDE: 'Grundlast- und Spitzenlastverträge für mitteleuropäische Märkte. RECs.', descEN: 'Baseload and peak contracts for Central European markets. RECs.', descES: 'Contratos de base y punta para mercados de Europa Central. RECs.', price: 'Auf Anfrage / On Request' },
    ],
    disclaimerDE: 'Quelle: CME Group / ICE öffentliche verzögerte Daten · Nur Informationszwecke · Keine Anlageempfehlung',
    disclaimerEN: 'Source: CME Group / ICE public delayed data · Informational only · No investment advice',
    disclaimerES: 'Fuente: CME Group / ICE datos públicos con retraso · Solo informativo · Sin asesoramiento de inversión',
  },
  agriculture: {
    stats: [
      { id: 'wheat', val: '$612',   label: 'Weizen CBOT/bu' },
      { id: 'corn',  val: '$489',   label: 'Mais CBOT/bu' },
      { id: 'soy',   val: '$1,320', label: 'Soja CBOT/bu' },
      { id: 'sugar', val: '490¢',   label: 'Zucker ICE/lb' },
    ],
    items: [
      { icon: '🌾', nameDE: 'Weizen & Getreide', nameEN: 'Wheat & Grains', nameES: 'Trigo y Cereales', descDE: 'CBOT- und Euronext-Weizen. Schwarzmeer-, ukrainische und französische Ursprünge. CIF, FOB, DAP.', descEN: 'CBOT and Euronext wheat. Black Sea, Ukrainian and French origins. CIF, FOB, DAP.', descES: 'Trigo CBOT y Euronext. Orígenes del Mar Negro, Ucrania y Francia. CIF, FOB, DAP.', price: '612.25 USc/bu' },
      { icon: '🌽', nameDE: 'Mais & Futtergetreide', nameEN: 'Corn & Feed Grains', nameES: 'Maíz y Cereales Forrajeros', descDE: 'US- und südamerikanische Ursprünge. Bulk- und Containerverschiffungen. Feed und Non-GMO.', descEN: 'US and South American origins. Bulk and container shipments. Feed and Non-GMO grades.', descES: 'Orígenes de EE.UU. y Sudamérica. Embarques a granel y en contenedor. Grados Feed y No-GMO.', price: '488.75 USc/bu' },
      { icon: '🫘', nameDE: 'Sojabohnen & Ölsaaten', nameEN: 'Soybeans & Oilseeds', nameES: 'Soja y Oleaginosas', descDE: 'CBOT-Soja, Raps und Sonnenblumen. Brasilianische und argentinische Ursprünge.', descEN: 'CBOT soybeans, rapeseed and sunflower. Brazilian and Argentine origins.', descES: 'Soja CBOT, colza y girasol. Orígenes brasileños y argentinos.', price: '1,320.00 USc/bu' },
      { icon: '🍚', nameDE: 'Reis & Mahlprodukte', nameEN: 'Rice & Milling Products', nameES: 'Arroz y Productos de Molinería', descDE: 'Asiatischer und südamerikanischer parboilierter, gemahlener Reis. Verschiedene Mahlgrade.', descEN: 'Asian and South American parboiled and milled rice. Various milling grades.', descES: 'Arroz vaporizado y molido asiático y sudamericano. Varios grados de molinería.', price: 'Auf Anfrage / On Request' },
      { icon: '🍬', nameDE: 'Softcommodities', nameEN: 'Soft Commodities', nameES: 'Materias Primas Blandas', descDE: 'Roh- und Weißzucker, Kaffee, Kakao und Baumwolle. ICE-gehandelt und OTC.', descEN: 'Raw and white sugar, coffee, cocoa and cotton. ICE-traded and OTC.', descES: 'Azúcar crudo y blanco, café, cacao y algodón. ICE y OTC.', price: 'Auf Anfrage / On Request' },
      { icon: '🌿', nameDE: 'Düngemittel & Betriebsmittel', nameEN: 'Fertilisers & Inputs', nameES: 'Fertilizantes e Insumos', descDE: 'Harnstoff, DAP, MAP, Kali und Ammoniak. Bulk-Schiffsversorgung von Hauptproduzenten.', descEN: 'Urea, DAP, MAP, potash and ammonia. Bulk vessel supply from major producers.', descES: 'Urea, DAP, MAP, potasa y amoníaco. Suministro a granel de principales productores.', price: 'Auf Anfrage / On Request' },
    ],
    disclaimerDE: 'Quelle: USDA / CME Group öffentliche Daten · Nur Informationszwecke · Keine Anlageempfehlung · Verbindliche Konditionen erst im Kaufvertrag',
    disclaimerEN: 'Source: USDA / CME Group public data · Informational only · No investment advice · Binding terms only in purchase contract',
    disclaimerES: 'Fuente: USDA / CME Group datos públicos · Solo informativo · Sin asesoramiento de inversión · Condiciones vinculantes solo en contrato de compra',
  },
};

export default function CommoditiesPage() {
  const t = useTranslations('commodities');
  const [activeTab, setActiveTab] = useState<Tab>('metals');

  // Detect locale from next-intl context for name/desc selection
  // We use a simple approach: check what the translation returns for a known key
  const tabLabel = t('tabMetals');
  const locale: 'de' | 'en' | 'es' = tabLabel.includes('Metalle') ? 'de' : tabLabel.includes('Metales') ? 'es' : 'en';

  const data = COMMODITY_DATA[activeTab];
  const tabs: { key: Tab; label: string }[] = [
    { key: 'metals',      label: t('tabMetals') },
    { key: 'energy',      label: t('tabEnergy') },
    { key: 'agriculture', label: t('tabAgri') },
  ];

  const getName = (item: typeof data.items[0]) =>
    locale === 'de' ? item.nameDE : locale === 'es' ? item.nameES : item.nameEN;
  const getDesc = (item: typeof data.items[0]) =>
    locale === 'de' ? item.descDE : locale === 'es' ? item.descES : item.descEN;
  const getDisclaimer = () =>
    locale === 'de' ? data.disclaimerDE : locale === 'es' ? data.disclaimerES : data.disclaimerEN;

  return (
    <div className="px-4 md:px-12 py-20 max-w-7xl mx-auto">
      <div className="section-eyebrow">{t('eyebrow')}</div>
      <h1 className="section-title">{t('title')}</h1>
      <p className="section-subtitle">{t('subtitle')}</p>

      {/* Tabs */}
      <div className="flex gap-px bg-border-default border border-border-default mb-px" role="tablist" aria-label="Commodity categories">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeTab === key}
            aria-controls={`panel-${key}`}
            onClick={() => setActiveTab(key)}
            className={`flex-1 px-5 py-4 text-xs font-bold tracking-wider uppercase transition-all duration-fast ${
              activeTab === key
                ? 'bg-ink-4 text-gold shadow-[inset_0_-2px_0_theme(colors.gold.DEFAULT)]'
                : 'bg-ink-3 text-text-secondary hover:text-text-primary hover:bg-ink-4'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="border border-border-default border-t-0"
      >
        {/* Intro + stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 pb-0">
          <div>
            <h2 className="font-display text-3xl font-light text-text-primary mb-3">
              {activeTab === 'metals'
                ? (locale === 'de' ? 'Metalle & Edelmetalle' : locale === 'es' ? 'Metales y Metales Preciosos' : 'Metals & Precious Metals')
                : activeTab === 'energy'
                ? (locale === 'de' ? 'Energieprodukte' : locale === 'es' ? 'Productos Energéticos' : 'Energy Products')
                : (locale === 'de' ? 'Agrarprodukte' : locale === 'es' ? 'Productos Agrícolas' : 'Agricultural Products')
              }
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              {activeTab === 'metals'
                ? (locale === 'de' ? 'Aurexon GmbH handelt physische Metalle und Edelmetalle auf eigene Rechnung über zertifizierte Schmelzereien, Raffinerien und akkreditierte Lageranlagen. Alle Transaktionen erfolgen als Eigenhandel unter österreichischem und EU-Recht.' : locale === 'es' ? 'Aurexon GmbH comercia metales físicos y metales preciosos por cuenta propia a través de fundidoras, refinerías y instalaciones de almacenamiento acreditadas.' : 'Aurexon GmbH trades physical metals and precious metals on own account through certified smelters, refineries and accredited storage facilities. All transactions are proprietary under Austrian and EU law.')
                : activeTab === 'energy'
                ? (locale === 'de' ? 'Aurexon GmbH handelt physische Energierohstoffe auf eigene Rechnung als direkter Käufer oder Verkäufer. Schwerpunkt: Europäische Energiemärkte, nordafrikanische und nahöstliche Versorgungskorridore.' : locale === 'es' ? 'Aurexon GmbH comercia materias primas energéticas físicas por cuenta propia como comprador o vendedor directo. Enfoque en mercados energéticos europeos y corredores de suministro norteafricanos y de Oriente Medio.' : 'Aurexon GmbH trades physical energy commodities on own account as a direct buyer or seller. Focus: European energy markets, North African and Middle Eastern supply corridors.')
                : (locale === 'de' ? 'Aurexon GmbH handelt physische Agrarprodukte auf eigene Rechnung als direkter Handelspartner. Schwarzmeer-Ursprünge, südamerikanisches Getreide und europäische Ölsaaten bilden den geographischen Schwerpunkt.' : locale === 'es' ? 'Aurexon GmbH comercia productos agrícolas físicos por cuenta propia como socio comercial directo. Los orígenes del Mar Negro, los cereales sudamericanos y las oleaginosas europeas constituyen el enfoque geográfico.' : 'Aurexon GmbH trades physical agricultural products on own account as a direct trading partner. Black Sea origins, South American grains and European oilseeds form the geographic focus.')
              }
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-border-default">
            {data.stats.map(({ id, val, label }) => (
              <div key={id} className="bg-ink-3 p-5">
                <div className="font-display text-2xl font-light text-gold mb-1">{val}</div>
                <div className="text-xs font-bold tracking-wider uppercase text-text-tertiary">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-default border-t border-border-default mt-8">
          {data.items.map((item) => (
            <div key={item.nameEN} className="bg-ink-3 p-6 hover:bg-ink-4 transition-colors duration-fast">
              <div className="text-xl mb-3" aria-hidden="true">{item.icon}</div>
              <div className="text-sm font-bold tracking-wide text-text-primary mb-1.5">{getName(item)}</div>
              <p className="text-xs leading-relaxed text-text-secondary mb-3">{getDesc(item)}</p>
              <div className="font-mono text-sm text-gold">{item.price}</div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="data-disclaimer m-6 mt-0" role="note">
          <svg className="w-3.5 h-3.5 flex-shrink-0 stroke-gold-dark fill-none" viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="5.5" strokeWidth="1.5"/><path d="M7 4.5v3M7 9v.5" strokeLinecap="round" strokeWidth="1.5"/>
          </svg>
          <p className="data-disclaimer-text">{getDisclaimer()}</p>
        </div>
      </div>
    </div>
  );
}
