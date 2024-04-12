'use server';

import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

import { UpdateCardOrder } from '@/actions/update-card-order/schema';
import { InputType, ReturnType } from '@/actions/update-card-order/types';

import { createSafeAction, ReturnTypeEnum } from '@/lib/create-safe-action';
import db from '@/lib/db';
import { route } from '@/lib/route';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error: 'Unauthorized',
    };
  }

  const { boardId, items } = data;
  let cards;

  try {
    const transaction = items.map((item) =>
      db.card.update({
        where: { id: item.id, list: { board: { orgId } } },
        data: { order: item.order, listId: item.listId },
      })
    );

    cards = await db.$transaction(transaction);
  } catch (err) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error: 'Failed to reorder card',
    };
  }

  revalidatePath(route('/board/[boardId]', { params: { boardId } }));
  return {
    type: ReturnTypeEnum.RESULT,
    data: cards,
  };
};

const updateCardOrder = createSafeAction(UpdateCardOrder, handler);

export default updateCardOrder;
