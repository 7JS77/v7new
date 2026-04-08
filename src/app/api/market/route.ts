import { NextResponse } from 'next/server';
import { marketCache } from '@/lib/cache';
import { env } from '@/lib/env';
import { FALLBACK_ASSETS, groupByCategory } from '@/lib/fallbackData';
import type { NormalizedAsset, MarketApiResponse } from '@/types';

const TWELVE_SYMBOLS = 'XAU/USD,XAG/USD,WTI/USD,BRENT/USD,NATGAS/USD,WHEAT/USD,CORN/USD';
const METAL_CURRENCIES = 'XAU,XAG,PA,PL,CU,NI,ZN,PB';

const TWELVE_CACHE_KEY = 'twelve_data';
const METAL_CACHE_KEY = 'metal_prices';
const TWELVE_TTL = 60; // 60s - respect 8 req/min free tier
const METAL_TTL = 3600; // 1 hour - daily updates

interface TwelveQuote {
  symbol: string;
  close?: string;
  previous_close?: string;
  percent_change?: string;
  change?: string;
  name?: string;
  status?: string;
}

interface MetalApiResult {
  success: boolean;
  rates?: Record<string, number>;
}

function mapTwelveSymbol(symbol: string): Partial<NormalizedAsset> {
  const map: Record<string, Partial<NormalizedAsset>> = {
    'XAU/USD':    { name: 'Gold',          nameDE: 'Gold',           category: 'metals',      unit: 'oz', dailySpot: true },
    'XAG/USD':    { name: 'Silver',        nameDE: 'Silber',         category: 'metals',      unit: 'oz', dailySpot: true },
    'WTI/USD':    { name: 'WTI Crude',     nameDE: 'WTI Crude',      category: 'energy',      unit: 'bbl', dailySpot: false },
    'BRENT/USD':  { name: 'Brent Crude',   nameDE: 'Brent Rohöl',    category: 'energy',      unit: 'bbl', dailySpot: false },
    'NATGAS/USD': { name: 'Natural Gas',   nameDE: 'Erdgas TTF',     category: 'energy',      unit: 'MMBtu', dailySpot: false },
    'WHEAT/USD':  { name: 'Wheat CBOT',    nameDE: 'Weizen (CBOT)',  category: 'agriculture', unit: 'bu', dailySpot: false },
    'CORN/USD':   { name: 'Corn CBOT',     nameDE: 'Mais (CBOT)',    category: 'agriculture', unit: 'bu', dailySpot: false },
  };
  return map[symbol] ?? {};
}

function mapMetalSymbol(symbol: string): Partial<NormalizedAsset> {
  const map: Record<string, Partial<NormalizedAsset>> = {
    'XAU': { name: 'Gold',       nameDE: 'Gold',       symbol: 'XAU/USD',   category: 'metals', unit: 'oz', dailySpot: true },
    'XAG': { name: 'Silver',     nameDE: 'Silber',     symbol: 'XAG/USD',   category: 'metals', unit: 'oz', dailySpot: true },
    'PA':  { name: 'Palladium',  nameDE: 'Palladium',  symbol: 'PALLADIUM', category: 'metals', unit: 'oz', dailySpot: true },
    'PL':  { name: 'Platinum',   nameDE: 'Platin',     symbol: 'PLATINUM',  category: 'metals', unit: 'oz', dailySpot: true },
    'CU':  { name: 'LME Copper', nameDE: 'LME Kupfer', symbol: 'COPPER',    category: 'metals', unit: 't',  dailySpot: true },
    'NI':  { name: 'Nickel',     nameDE: 'Nickel',     symbol: 'NICKEL',    category: 'metals', unit: 't',  dailySpot: true },
    'ZN':  { name: 'Zinc',       nameDE: 'Zink',       symbol: 'ZINC',      category: 'metals', unit: 't',  dailySpot: true },
    'PB':  { name: 'Lead',       nameDE: 'Blei',       symbol: 'LEAD',      category: 'metals', unit: 't',  dailySpot: true },
  };
  return map[symbol] ?? {};
}

async function fetchTwelveData(apiKey: string): Promise<NormalizedAsset[] | null> {
  const cached = marketCache.get(TWELVE_CACHE_KEY) as NormalizedAsset[] | null;
  if (cached) return cached;

  try {
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(TWELVE_SYMBOLS)}&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 0 } });

    if (res.status === 429) {
      console.warn('Twelve Data rate limit hit');
      return null;
    }
    if (!res.ok) throw new Error(`Twelve Data HTTP ${res.status}`);

    const data = await res.json() as Record<string, TwelveQuote>;
    const assets: NormalizedAsset[] = [];

    for (const [sym, quote] of Object.entries(data)) {
      if (quote.status === 'error' || !quote.close) continue;
      const price = parseFloat(quote.close);
      const prevClose = parseFloat(quote.previous_close ?? quote.close);
      const change = price - prevClose;
      const changePct = prevClose > 0 ? (change / prevClose) * 100 : 0;
      const meta = mapTwelveSymbol(sym);

      assets.push({
        symbol: sym,
        name: meta.name ?? sym,
        nameDE: meta.nameDE ?? sym,
        price,
        change,
        changePercent: changePct,
        currency: 'USD',
        unit: meta.unit ?? '',
        category: meta.category ?? 'general' as 'metals',
        source: 'twelve',
        delayed: true,
        dailySpot: meta.dailySpot ?? false,
      });
    }

    marketCache.set(TWELVE_CACHE_KEY, assets, TWELVE_TTL);
    return assets;
  } catch (err) {
    console.error('Twelve Data fetch error:', err);
    return null;
  }
}

async function fetchMetalPrices(apiKey: string): Promise<NormalizedAsset[] | null> {
  const cached = marketCache.get(METAL_CACHE_KEY) as NormalizedAsset[] | null;
  if (cached) return cached;

  try {
    const url = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=${METAL_CURRENCIES}`;
    const res = await fetch(url, { next: { revalidate: 0 } });

    if (!res.ok) throw new Error(`MetalpriceAPI HTTP ${res.status}`);

    const data = await res.json() as MetalApiResult;
    if (!data.success || !data.rates) return null;

    const assets: NormalizedAsset[] = [];
    for (const [sym, rate] of Object.entries(data.rates)) {
      if (!rate || rate === 0) continue;
      const price = 1 / rate; // API returns units per 1 USD, invert for price per oz/t
      const meta = mapMetalSymbol(sym);
      if (!meta.name) continue;

      assets.push({
        symbol: meta.symbol ?? sym,
        name: meta.name,
        nameDE: meta.nameDE ?? meta.name,
        price,
        change: 0,
        changePercent: 0,
        currency: 'USD',
        unit: meta.unit ?? 'oz',
        category: meta.category ?? 'metals',
        source: 'metal',
        delayed: false,
        dailySpot: true,
      });
    }

    marketCache.set(METAL_CACHE_KEY, assets, METAL_TTL);
    return assets;
  } catch (err) {
    console.error('MetalpriceAPI fetch error:', err);
    return null;
  }
}

export async function GET(): Promise<NextResponse<MarketApiResponse>> {
  const hasApiKeys = env.TWELVE_DATA_API_KEY && env.TWELVE_DATA_API_KEY !== 'your_regenerated_key';
  const hasMetalKey = env.METALPRICE_API_KEY && env.METALPRICE_API_KEY !== 'your_regenerated_key';

  let allAssets: NormalizedAsset[] = [];
  let cached = false;
  let sourceDelay = true;

  if (hasApiKeys || hasMetalKey) {
    const [twelveAssets, metalAssets] = await Promise.allSettled([
      hasApiKeys ? fetchTwelveData(env.TWELVE_DATA_API_KEY) : Promise.resolve(null),
      hasMetalKey ? fetchMetalPrices(env.METALPRICE_API_KEY) : Promise.resolve(null),
    ]);

    const twelve = twelveAssets.status === 'fulfilled' ? twelveAssets.value : null;
    const metals = metalAssets.status === 'fulfilled' ? metalAssets.value : null;

    // Merge: prefer Twelve Data for price; Metal API for precious metals spot
    const assetMap = new Map<string, NormalizedAsset>();

    if (twelve) {
      twelve.forEach((a) => assetMap.set(a.symbol, a));
    }
    if (metals) {
      metals.forEach((a) => {
        if (!assetMap.has(a.symbol)) {
          assetMap.set(a.symbol, a);
        }
      });
      sourceDelay = false;
    }

    allAssets = Array.from(assetMap.values());
    cached = marketCache.has(TWELVE_CACHE_KEY) || marketCache.has(METAL_CACHE_KEY);
  }

  // Fall back to demo data if no API keys or all fetches failed
  if (allAssets.length === 0) {
    allAssets = FALLBACK_ASSETS.map((a) => ({ ...a, delayed: true }));
    cached = false;
    sourceDelay = true;
  }

  const byCategory = groupByCategory(allAssets);

  return NextResponse.json({
    data: { assets: allAssets, byCategory },
    disclaimer: 'Delayed data (15 min) · Informational only · No investment advice · Binding terms only in purchase contract',
    updated: new Date().toISOString(),
    source_delay: sourceDelay,
    cached,
  });
}
