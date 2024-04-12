import { z } from 'zod';

export const UpdateCardOrder = z.object({
  boardId: z.string().readonly(),
  items: z.array(
    z.object({
      id: z.string().readonly(),
      title: z.string(),
      order: z.number(),
      listId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
});
