# Aurexon GmbH v7 – Next.js 14 Application

**Austrian physical commodity trading company website** — production-ready, enterprise-grade Next.js 14 App Router application.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14.2.3 (App Router, RSC) |
| Language | TypeScript 5.4 (strict: true) |
| Styling | TailwindCSS 3.4 |
| i18n | next-intl 3.14 (/de, /en, /es) |
| Data fetching | SWR 2.2 (client), Route Handlers (server) |
| Validation | Zod 3.23 |
| Hosting | Vercel (ISR/SSG hybrid) |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in values
cp .env.example .env.local

# 3. Run development server
npm run dev
# → http://localhost:3000 (redirects to /de)
```

---

## Environment Variables

Create `.env.local` from `.env.example`:

| Variable | Required | Description |
|----------|----------|-------------|
| `TWELVE_DATA_API_KEY` | Yes* | Market data – [twelvedata.com](https://twelvedata.com) (free: 8 req/min) |
| `METALPRICE_API_KEY` | Yes* | Metal spot prices – [metalpriceapi.com](https://metalpriceapi.com) (free: daily) |
| `RECAPTCHA_SECRET_KEY` | No | Google reCAPTCHA v3 for forms |
| `RESEND_API_KEY` | No | Email delivery – [resend.com](https://resend.com) (free: 100/day) |
| `CONTACT_EMAIL` | No | Recipient email (default: office@aurexon.at) |
| `NEXT_PUBLIC_APP_URL` | No | Canonical URL (default: https://aurexon.at) |

> *Without API keys, the site uses realistic fallback/demo data. All features remain functional.

---

## Project Structure

```
aurexon-v7/
├── messages/
│   ├── de.json          # German (primary)
│   ├── en.json          # English
│   └── es.json          # Spanish
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx          # Root locale layout
│   │   │   ├── page.tsx            # Home
│   │   │   ├── markets/            # Live market tables
│   │   │   ├── commodities/        # Commodity cards
│   │   │   ├── intelligence/       # News feed
│   │   │   ├── incoterms/          # Incoterms 2020
│   │   │   ├── intermediation/     # VTD workflow + form
│   │   │   ├── about/              # Company profile
│   │   │   ├── contact/            # Contact form
│   │   │   ├── impressum/          # Legal: Imprint
│   │   │   ├── datenschutz/        # Legal: Privacy
│   │   │   ├── haftungsausschluss/ # Legal: Disclaimer
│   │   │   └── agb/                # Legal: T&Cs
│   │   └── api/
│   │       ├── market/route.ts     # Market data proxy (LRU cache 60s/3600s)
│   │       ├── news/route.ts       # News aggregator (cache 30m)
│   │       ├── inquiry/route.ts    # VTD form handler
│   │       └── contact/route.ts    # Contact form handler
│   ├── components/
│   │   ├── Navigation.tsx          # Responsive nav + language switcher
│   │   ├── LegalBanner.tsx         # Dismissible legal notice
│   │   ├── PriceTicker.tsx         # Scrolling price bar (SWR)
│   │   ├── MarketTable.tsx         # Sortable market table (SWR)
│   │   ├── NewsGrid.tsx            # News card grid (SWR)
│   │   ├── Footer.tsx              # Multi-column footer
│   │   ├── CookieConsent.tsx       # GDPR cookie banner
│   │   └── ui/Toast.tsx            # Toast notification system
│   ├── contexts/
│   │   └── CookieContext.tsx       # Cookie consent state
│   ├── lib/
│   │   ├── env.ts                  # Zod env validation
│   │   ├── cache.ts                # TTL LRU cache
│   │   ├── i18n.ts                 # next-intl config
│   │   ├── zodSchemas.ts           # Form validation schemas
│   │   ├── fallbackData.ts         # Demo data (API unavailable)
│   │   └── incotermsData.ts        # All 11 Incoterms 2020
│   └── types/index.ts              # All TypeScript interfaces
├── middleware.ts                    # i18n locale routing
├── next.config.mjs                  # Next.js + security headers
├── tailwind.config.ts               # Aurexon design tokens
└── .env.example                     # Environment template
```

---

## Routing

| URL | Page |
|-----|------|
| `/` | Redirects to `/de` |
| `/de` `/en` `/es` | Home page |
| `/[locale]/markets` | Live market tables |
| `/[locale]/commodities` | Physical commodity sectors |
| `/[locale]/intelligence` | Public market reports & analysis |
| `/[locale]/incoterms` | Incoterms 2020 reference |
| `/[locale]/intermediation` | VTD workflow + inquiry form |
| `/[locale]/about` | Company profile |
| `/[locale]/contact` | Contact form |
| `/[locale]/impressum` | Imprint (§ 5 ECG) |
| `/[locale]/datenschutz` | Privacy policy (GDPR) |
| `/[locale]/haftungsausschluss` | Disclaimer (BWG/WAG 2018) |
| `/[locale]/agb` | General terms & conditions |
| `/api/market` | Market data proxy (GET) |
| `/api/news` | News aggregator (GET) |
| `/api/inquiry` | VTD form handler (POST) |
| `/api/contact` | Contact form handler (POST) |

---

## API Caching Strategy

| Route | Cache TTL | Reason |
|-------|-----------|--------|
| `/api/market` (Twelve Data) | 60 seconds | Free tier: 8 req/min |
| `/api/market` (MetalpriceAPI) | 3600 seconds | Daily update rate |
| `/api/news` | 1800 seconds | 30-minute news cache |

On API failure (429/5xx), cached data is returned with a warning header.

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

Set environment variables in Vercel Dashboard → Project Settings → Environment Variables.

**Required Vercel settings:**
- Node.js version: 18.x or 20.x
- Build command: `npm run build`
- Output directory: `.next`

---

## i18n Verification Checklist

Before going live, verify all three locales:

### German (/de)
- [ ] `intelligence.title` = "Öffentliche Marktberichte & Analyse"
- [ ] Legal banner uses German text
- [ ] Form labels in German
- [ ] Cookie consent in German

### English (/en)
- [ ] `intelligence.title` = **"Public Market Reports & Analysis"** (not German)
- [ ] All nav links in English
- [ ] Form labels in English
- [ ] Legal pages in English

### Spanish (/es)
- [ ] `intelligence.title` = "Informes y Análisis de Mercado Público"
- [ ] All strings in Spanish
- [ ] Form labels in Spanish

### All locales
- [ ] `<html lang>` updates on locale switch
- [ ] Language choice persists in `localStorage`
- [ ] URL updates when switching locale (`/de/markets` → `/en/markets`)
- [ ] Legal banner dismissal persists across locale switches

---

## Legal Compliance

This application implements Austrian trade law compliance:

- **BWG/WAG 2018**: Legal banner + disclaimer on every market data section
- **GDPR/DSGVO**: Cookie consent gates analytics; forms require explicit consent checkbox
- **§ 5 ECG**: Full Impressum at `/[locale]/impressum`
- **Art. 13-14 DSGVO**: Privacy policy at `/[locale]/datenschutz`
- **NDA protection**: VTD inquiry form includes compliance checkbox and NDA confirmation
- **No hardcoded prices**: All market data dynamic via API with fallback to demo data

---

## Development Notes

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build (production)
npm run build

# Start production server
npm start
```

### Adding a real logo

Place your logo at `public/logo.jpg`. The layout server component reads it and passes base64 to Navigation and Footer.

### Enabling RSS news

Add `rss-parser` to dependencies:
```bash
npm install rss-parser
```
Then implement actual RSS parsing in `src/app/api/news/route.ts`.

### Enabling email (Resend)

```bash
npm install resend
```
Add `RESEND_API_KEY` to `.env.local` and uncomment the Resend code in `src/app/api/inquiry/route.ts` and `src/app/api/contact/route.ts`.
