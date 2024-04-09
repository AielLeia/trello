import { z } from 'zod';

const EnvSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().readonly(),
  CLERK_SECRET_KEY: z.string().readonly(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().readonly(),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().readonly(),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().readonly(),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().readonly(),
});

const EnvConfigResult = EnvSchema.safeParse(process.env);
if (!EnvConfigResult.success) {
  throw new Error(EnvConfigResult.error.toString());
}

export const EnvConfig = EnvConfigResult.data;
