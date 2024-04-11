import { z } from 'zod';

export const DeleteList = z.object({
  id: z.string().readonly(),
  boardId: z.string().readonly(),
});
