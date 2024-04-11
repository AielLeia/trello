import { EnvConfig } from '@/config/env';
import { createApi } from 'unsplash-js';

export const unsplash = createApi({
  accessKey: EnvConfig.NEXT_PUBLIC_UNSPLASH_API_KEY,
  fetch: fetch,
});
