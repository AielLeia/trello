import { EnvConfig } from '@/config/env';
import Stripe from 'stripe';

export const stripe = new Stripe(EnvConfig.STRIPE_API_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
});
