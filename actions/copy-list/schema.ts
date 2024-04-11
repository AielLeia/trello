import { z } from 'zod';

export const CopyList = z.object({
  id: z.string().readonly(),
  boardId: z.string().readonly(),
});
