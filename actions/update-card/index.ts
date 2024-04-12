'use server';

import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

import { UpdateCard } from '@/actions/update-card/schema';
import { InputType, ReturnType } from '@/actions/update-card/types';

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

  const { id, boardId, ...values } = data;
  let card;

  try {
    card = await db.card.update({
      where: { id, list: { board: { orgId } } },
      data: { ...values },
    });
  } catch (err) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error: 'Failed to update card',
    };
  }

  revalidatePath(route('/board/[boardId]', { params: { boardId } }));
  return {
    type: ReturnTypeEnum.RESULT,
    data: card,
  };
};

const updateCard = createSafeAction(UpdateCard, handler);

export default updateCard;
