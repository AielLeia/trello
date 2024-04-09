import { z } from 'zod';

const EnvSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().readonly(),
  CLERK_SECRET_KEY: z.string().readonly(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().readonly(),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().readonly(),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().readonly(),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().readonly(),
  DATABASE_URL: z.string().readonly(),
  SHADOW_DATABASE_URL: z.string().readonly(),
});

export const EnvConfig = EnvSchema.parse(process.env);
