import { z } from 'zod';

const envSchema = z.object({
  TWELVE_DATA_API_KEY: z.string().min(1, 'TWELVE_DATA_API_KEY is required'),
  METALPRICE_API_KEY: z.string().min(1, 'METALPRICE_API_KEY is required'),
  RECAPTCHA_SECRET_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  CONTACT_EMAIL: z.string().email().default('office@aurexon.at'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('https://aurexon.at'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Provide defaults for build-time when keys aren't set (CI/CD)
const rawEnv = {
  TWELVE_DATA_API_KEY: process.env.TWELVE_DATA_API_KEY ?? '',
  METALPRICE_API_KEY: process.env.METALPRICE_API_KEY ?? '',
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NODE_ENV: process.env.NODE_ENV,
};

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  const missing = parsed.error.issues
    .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
    .join('\n');
  
  // Only throw in production to allow local dev without all keys
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`❌ Invalid environment variables:\n${missing}\n\nSee .env.example for required variables.`);
  } else {
    console.warn(`⚠️  Missing environment variables:\n${missing}\n\nMarket data will use fallback/demo values.`);
  }
}

export const env = parsed.success ? parsed.data : rawEnv as z.infer<typeof envSchema>;
export const isDev = env.NODE_ENV === 'development';
export const isProd = env.NODE_ENV === 'production';
