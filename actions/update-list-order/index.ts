'use server';

import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

import { UpdateListOrder } from '@/actions/update-list-order/schema';
import { InputType, ReturnType } from '@/actions/update-list-order/types';

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
  let lists;

  try {
    const transaction = items.map((list) =>
      db.list.update({
        where: { id: list.id, boardId, board: { orgId } },
        data: { order: list.order },
      })
    );

    lists = await db.$transaction(transaction);
  } catch (err) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error: 'Failed to reorder list',
    };
  }

  revalidatePath(route('/board/[boardId]', { params: { boardId } }));
  return {
    type: ReturnTypeEnum.RESULT,
    data: lists,
  };
};

const updateListOrder = createSafeAction(UpdateListOrder, handler);

export default updateListOrder;
