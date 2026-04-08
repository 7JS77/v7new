import type { NormalizedAsset, NewsArticle } from '@/types';

export const FALLBACK_ASSETS: NormalizedAsset[] = [
  { symbol: 'XAU/USD', name: 'Gold', nameDE: 'Gold', price: 2345.10, change: -9.40, changePercent: -0.40, currency: 'USD', unit: 'oz', category: 'metals', source: 'fallback', delayed: true, dailySpot: true },
  { symbol: 'XAG/USD', name: 'Silver', nameDE: 'Silber', price: 28.15, change: 0.14, changePercent: 0.50, currency: 'USD', unit: 'oz', category: 'metals', source: 'fallback', delayed: true, dailySpot: true },
  { symbol: 'PLATINUM', name: 'Platinum', nameDE: 'Platin', price: 965.00, change: -2.90, changePercent: -0.30, currency: 'USD', unit: 'oz', category: 'metals', source: 'fallback', delayed: true, dailySpot: true },
  { symbol: 'PALLADIUM', name: 'Palladium', nameDE: 'Palladium', price: 1020.30, change: -11.20, changePercent: -1.10, currency: 'USD', unit: 'oz', category: 'metals', source: 'fallback', delayed: true, dailySpot: true },
  { symbol: 'COPPER', name: 'LME Copper', nameDE: 'LME Kupfer', price: 9820.50, change: 202.10, changePercent: 2.10, currency: 'USD', unit: 't', category: 'metals', source: 'fallback', delayed: true, dailySpot: true },
  { symbol: 'ALUMINIUM', name: 'LME Aluminium', nameDE: 'LME Aluminium', price: 2540.00, change: -5.10, changePercent: -0.20, currency: 'USD', unit: 't', category: 'metals', source: 'fallback', delayed: true, dailySpot: true },
  { symbol: 'BRENT', name: 'Brent Crude', nameDE: 'Brent Rohöl', price: 84.25, change: 1.00, changePercent: 1.20, currency: 'USD', unit: 'bbl', category: 'energy', source: 'fallback', delayed: true, dailySpot: false },
  { symbol: 'WTI', name: 'WTI Crude', nameDE: 'WTI Crude', price: 79.80, change: 1.10, changePercent: 1.40, currency: 'USD', unit: 'bbl', category: 'energy', source: 'fallback', delayed: true, dailySpot: false },
  { symbol: 'NATGAS', name: 'Natural Gas TTF', nameDE: 'Erdgas TTF', price: 32.40, change: 0.26, changePercent: 0.80, currency: 'EUR', unit: 'MWh', category: 'energy', source: 'fallback', delayed: true, dailySpot: false },
  { symbol: 'WHEAT', name: 'Wheat CBOT', nameDE: 'Weizen (CBOT)', price: 612.25, change: 9.00, changePercent: 1.50, currency: 'USD', unit: 'bu', category: 'agriculture', source: 'fallback', delayed: true, dailySpot: false },
  { symbol: 'CORN', name: 'Corn CBOT', nameDE: 'Mais (CBOT)', price: 488.75, change: 2.90, changePercent: 0.60, currency: 'USD', unit: 'bu', category: 'agriculture', source: 'fallback', delayed: true, dailySpot: false },
  { symbol: 'SOYBEAN', name: 'Soybean CBOT', nameDE: 'Soja (CBOT)', price: 1320.00, change: 12.50, changePercent: 0.95, currency: 'USD', unit: 'bu', category: 'agriculture', source: 'fallback', delayed: true, dailySpot: false },
];

export const FALLBACK_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'European Energy Markets Stabilize Amid New Supply Routes',
    summary: 'Natural gas futures see reduced volatility as alternative supply chains from North Africa and LNG terminals reach operational capacity ahead of winter demand spikes.',
    source: 'Reuters Commodities',
    sourceUrl: 'https://reuters.com',
    category: 'energy',
    publishedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    url: '#',
  },
  {
    id: '2',
    title: 'Precious Metals Rally on Inflation Data Revisions',
    summary: 'Gold and silver spot prices experienced a sharp uptick following the latest core PCE data revisions, signaling potential shifts in central bank rate trajectories.',
    source: 'CME Group',
    sourceUrl: 'https://cmegroup.com',
    category: 'metals',
    publishedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    url: '#',
  },
  {
    id: '3',
    title: 'Agricultural Yield Forecasts Impact Q3 Futures',
    summary: 'Revised weather models for the Midwest have led to a recalibration of corn and wheat yield expectations, driving increased hedging activity in near-term contracts.',
    source: 'USDA',
    sourceUrl: 'https://usda.gov',
    category: 'agriculture',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    url: '#',
  },
];

export function groupByCategory(assets: NormalizedAsset[]) {
  return {
    metals: assets.filter((a) => a.category === 'metals'),
    energy: assets.filter((a) => a.category === 'energy'),
    agriculture: assets.filter((a) => a.category === 'agriculture'),
  };
}
