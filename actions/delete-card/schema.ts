import { z } from 'zod';

export const DeleteCard = z.object({
  id: z.string().readonly(),
  boardId: z.string().readonly(),
});
