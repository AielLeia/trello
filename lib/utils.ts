import { EnvConfig } from '@/config/env';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${EnvConfig.NEXT_PUBLIC_APP_URL}${path}`;
}
