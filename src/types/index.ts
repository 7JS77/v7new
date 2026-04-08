// ─── Market Data Types ─────────────────────────────────────────
export interface TwelveDataQuote {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  previous_close: string;
  change: string;
  percent_change: string;
  is_market_open: boolean;
  fifty_two_week: {
    low: string;
    high: string;
  };
  timestamp: number;
}

export interface MetalPriceData {
  success: boolean;
  base: string;
  rates: Record<string, number>;
  unit: string;
  timestamp: number;
}

export interface NormalizedAsset {
  symbol: string;
  name: string;
  nameDE: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  unit: string;
  category: 'metals' | 'energy' | 'agriculture';
  source: 'twelve' | 'metal' | 'fallback';
  delayed: boolean;
  dailySpot: boolean;
}

export interface MarketApiResponse {
  data: {
    assets: NormalizedAsset[];
    byCategory: {
      metals: NormalizedAsset[];
      energy: NormalizedAsset[];
      agriculture: NormalizedAsset[];
    };
  };
  disclaimer: string;
  updated: string;
  source_delay: boolean;
  cached: boolean;
  error?: string;
}

// ─── News Types ─────────────────────────────────────────────────
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: 'energy' | 'metals' | 'agriculture' | 'general';
  publishedAt: string;
  url: string;
}

export interface NewsApiResponse {
  articles: NewsArticle[];
  disclaimer: string;
  updated: string;
  cached: boolean;
}

// ─── Form Types ─────────────────────────────────────────────────
export interface ContactFormPayload {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  privacyConsent: boolean;
  honeypot?: string;
}

export interface InquiryFormPayload {
  name: string;
  company: string;
  email: string;
  phone?: string;
  role: 'seller' | 'buyer' | 'broker' | 'other';
  commodityCategory: 'metals' | 'energy' | 'agriculture';
  quantity?: string;
  incoterm?: string;
  description: string;
  ndaConsent: boolean;
  complianceConsent: boolean;
  honeypot?: string;
}

export interface FormResponse {
  success: boolean;
  message: string;
  id?: string;
}

// ─── Incoterm Types ─────────────────────────────────────────────
export type IncotermMode = 'any' | 'sea';

export interface Incoterm {
  code: string;
  name: string;
  nameDE: string;
  description: string;
  descriptionDE: string;
  mode: IncotermMode;
}

// ─── Cookie Consent Types ───────────────────────────────────────
export interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  timestamp: number;
}

// ─── i18n Types ─────────────────────────────────────────────────
export type Locale = 'de' | 'en' | 'es';

// ─── Commodity Types ────────────────────────────────────────────
export interface CommodityItem {
  id: string;
  icon: string;
  nameDE: string;
  nameEN: string;
  nameES: string;
  descDE: string;
  descEN: string;
  descES: string;
  category: 'metals' | 'energy' | 'agriculture';
  priceId?: string;
  unit: string;
}
