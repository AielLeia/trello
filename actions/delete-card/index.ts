'use server';

import { auth } from '@clerk/nextjs';
import { Action, EntityType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { DeleteCard } from '@/actions/delete-card/schema';
import { InputType, ReturnType } from '@/actions/delete-card/types';

import { createAuditLog } from '@/lib/create-audit-log';
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

  const { id, boardId } = data;
  let card;

  try {
    card = await db.card.delete({
      where: { id, list: { board: { orgId } } },
    });
    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: EntityType.Card,
      action: Action.Delete,
    });
  } catch (err) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error: 'Failed to delete card',
    };
  }

  revalidatePath(route('/board/[boardId]', { params: { boardId } }));
  return {
    type: ReturnTypeEnum.RESULT,
    data: card,
  };
};

const deleteCard = createSafeAction(DeleteCard, handler);

export default deleteCard;
