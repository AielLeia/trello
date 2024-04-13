import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const EnvConfig = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string().readonly(),
    DATABASE_URL: z.string().url().readonly(),
    SHADOW_DATABASE_URL: z.string().url().readonly(),
    UNSPLASH_SECRET_KEY: z.string().readonly(),
    STRIPE_API_KEY: z.string().readonly(),
    STRIPE_WEBHOOK_SECRET: z.string().readonly(),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().readonly(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().readonly(),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().readonly(),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().readonly(),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().readonly(),
    NEXT_PUBLIC_UNSPLASH_API_KEY: z.string().readonly(),
    NEXT_PUBLIC_APP_URL: z.string().readonly(),
  },
  runtimeEnv: {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    SHADOW_DATABASE_URL: process.env.SHADOW_DATABASE_URL,
    NEXT_PUBLIC_UNSPLASH_API_KEY: process.env.NEXT_PUBLIC_UNSPLASH_API_KEY,
    UNSPLASH_SECRET_KEY: process.env.UNSPLASH_SECRET_KEY,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:
      process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:
      process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
