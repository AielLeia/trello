import { z } from 'zod';

export const CopyCard = z.object({
  id: z.string().readonly(),
  boardId: z.string().readonly(),
});
