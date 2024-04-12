import { z } from 'zod';

export const UpdateListOrder = z.object({
  boardId: z.string().readonly(),
  items: z.array(
    z.object({
      id: z.string().readonly(),
      title: z.string(),
      order: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
});
