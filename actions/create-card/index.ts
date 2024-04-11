'use server';

import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

import { CreateCard } from '@/actions/create-card/schema';
import { InputType, ReturnType } from '@/actions/create-card/types';

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

  const { title, listId, boardId } = data;
  let card;

  try {
    const list = await db.list.findUnique({
      where: { id: listId, boardId, board: { orgId } },
    });
    if (!list) {
      return {
        type: ReturnTypeEnum.GENERALE_ERROR,
        error: 'List not found',
      };
    }

    const lastCard = await db.card.findFirst({
      where: { listId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        listId,
        title,
        order: newOrder,
      },
    });
  } catch (err) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error: 'Failed to create card',
    };
  }

  revalidatePath(route('/board/[boardId]', { params: { boardId } }));
  return {
    type: ReturnTypeEnum.RESULT,
    data: card,
  };
};

const createCard = createSafeAction(CreateCard, handler);

export default createCard;
