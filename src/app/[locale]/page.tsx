import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

interface HomePageProps {
  params: { locale: Locale };
}

export default async function HomePage({ params: { locale } }: HomePageProps) {
  const h = await getTranslations({ locale, namespace: 'hero' });
  const tr = await getTranslations({ locale, namespace: 'trust' });

  const trustItems = [
    { val: '$4.2B+', label: tr('vol') },
    { val: '45+',    label: tr('mkts') },
    { val: '120+',   label: tr('partners') },
    { val: '24/7',   label: tr('desk') },
    { val: 'Wien',   label: tr('sitz') },
  ];

  return (
    <>
      <section
        id="home"
        className="relative min-h-[calc(100vh-138px)] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-4 md:px-12 py-20 overflow-hidden bg-ink"
        aria-labelledby="hero-h1"
      >
        <div className="absolute top-[-200px] right-[-160px] w-[680px] h-[680px] gradient-radial-gold pointer-events-none" aria-hidden="true"/>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-dark to-transparent" aria-hidden="true"/>

        <div className="relative z-10">
          <div className="section-eyebrow">{h('eyebrow')}</div>
          <h1 id="hero-h1" className="font-display font-light leading-tight text-text-primary mb-3" style={{ fontSize: 'clamp(44px,4.8vw,74px)' }}>
            <em className="italic text-gold">{h('title1')}</em><br/>
            <span>{h('title2')}</span>
          </h1>
          <div className="font-mono text-xs text-text-tertiary tracking-wide mb-5 px-3 py-2 bg-ink-3 border-l-2 border-gold-dark inline-block" aria-label="Legal form">
            {h('rechtsform')}
          </div>
          <p className="text-base leading-relaxed text-text-secondary max-w-md mb-3">{h('body')}</p>
          <p className="text-sm text-text-tertiary italic mb-10">{h('neben')}</p>
          <div className="flex gap-3 flex-wrap">
            <Link href={`/${locale}/commodities`} className="btn-primary">{h('cta1')}</Link>
            <Link href={`/${locale}/markets`} className="btn-outline">{h('cta2')}</Link>
          </div>
        </div>

        <div className="hidden lg:block relative z-10">
          <div className="bg-ink-3 border border-border-default p-8 relative">
            <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-gold to-gold-dark" aria-hidden="true"/>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-subtle">
              <span className="text-xs font-bold tracking-ultra uppercase text-text-secondary">{h('panelTitle')}</span>
              <span className="live-dot">{h('panelLive')}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { name: 'BRENT',  price: '84.25',     change: '+1.20%', pos: true },
                { name: 'GOLD',   price: '2,345.10',  change: '-0.40%', pos: false },
                { name: 'KUPFER', price: '9,820.50',  change: '+2.10%', pos: true },
                { name: 'WEIZEN', price: '612.25',    change: '+1.50%', pos: true },
              ].map((item) => (
                <div key={item.name} className="bg-ink-4 border border-border-subtle p-3 hover:border-border-default transition-colors">
                  <div className="text-xs font-bold tracking-wider uppercase text-text-tertiary mb-1.5">{item.name}</div>
                  <div className="font-mono text-lg text-text-primary mb-1">{item.price}</div>
                  <div className={`font-mono text-xs ${item.pos ? 'text-success' : 'text-error'}`}>{item.change}</div>
                </div>
              ))}
            </div>
            <div className="data-disclaimer" role="note">
              <svg className="w-3.5 h-3.5 flex-shrink-0 stroke-gold-dark fill-none" viewBox="0 0 14 14"><circle cx="7" cy="7" r="5.5" strokeWidth="1.5"/><path d="M7 4.5v3M7 9v.5" strokeLinecap="round" strokeWidth="1.5"/></svg>
              <p className="data-disclaimer-text">Quelle: Twelve Data · Nur Informationszwecke · Keine Anlageempfehlung</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex gap-px bg-border-default border border-border-default flex-wrap" role="list" aria-label="Key figures">
          {trustItems.map(({ val, label }) => (
            <div key={label} className="bg-ink-2 py-5 px-6 flex-1 text-center min-w-24" role="listitem">
              <div className="font-display text-2xl font-light text-gold leading-none mb-1">{val}</div>
              <div className="text-xs font-bold tracking-wider uppercase text-text-tertiary">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-12 py-20 bg-ink-2" aria-label="Services overview">
        <div className="max-w-7xl mx-auto">
          <div className="section-eyebrow">Aurexon GmbH</div>
          <h2 className="section-title mb-3">
            {locale === 'de' ? 'Eigenhandel & Vermittlung' : locale === 'es' ? 'Comercio Propio & Intermediación' : 'Proprietary Trading & Intermediation'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border-default border border-border-default mt-10">
            {[
              { href: '/markets',        icon: '📊', titleDE: 'Marktübersicht',          titleEN: 'Market Overview',           titleES: 'Vista del Mercado',         descDE: 'Öffentliche Preisdaten für Metalle, Energie und Agrarprodukte', descEN: 'Public price data for metals, energy and agricultural products', descES: 'Datos de precios públicos para metales, energía y productos agrícolas' },
              { href: '/commodities',    icon: '⚖️', titleDE: 'Rohstoffe',               titleEN: 'Commodities',               titleES: 'Materias Primas',           descDE: 'Physischer Eigenhandel in drei Kernbereichen', descEN: 'Proprietary physical trading across three core sectors', descES: 'Comercio físico propio en tres sectores principales' },
              { href: '/intermediation', icon: '🤝', titleDE: 'Vermittlungsunterstützung', titleEN: 'Intermediation Support',    titleES: 'Apoyo de Intermediación',   descDE: 'Vertrauliche Kontaktvermittlung (Nebentätigkeit)', descEN: 'Confidential counterparty introductions (ancillary)', descES: 'Presentaciones confidenciales de contrapartes (accesorio)' },
            ].map(({ href, icon, titleDE, titleEN, titleES, descDE, descEN, descES }) => {
              const title = locale === 'de' ? titleDE : locale === 'es' ? titleES : titleEN;
              const desc  = locale === 'de' ? descDE  : locale === 'es' ? descES  : descEN;
              return (
                <Link key={href} href={`/${locale}${href}`} className="group bg-ink-3 p-10 hover:bg-ink-4 transition-colors duration-fast relative overflow-hidden block">
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" aria-hidden="true"/>
                  <div className="text-2xl mb-5" aria-hidden="true">{icon}</div>
                  <h3 className="font-display text-2xl font-light text-text-primary mb-2 group-hover:text-gold transition-colors">{title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
