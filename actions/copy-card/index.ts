'use server';

import { auth } from '@clerk/nextjs';
import { Action, EntityType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { CopyCard } from '@/actions/copy-card/schema';
import { InputType, ReturnType } from '@/actions/copy-card/types';

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
    const cardToCopy = await db.card.findUnique({
      where: { id, list: { board: { orgId } } },
    });
    if (!cardToCopy) {
      return {
        type: ReturnTypeEnum.GENERALE_ERROR,
        error: 'Card not found',
      };
    }

    const lastCard = await db.card.findFirst({
      where: { listId: cardToCopy.listId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        title: `${cardToCopy.title} - Copy`,
        description: `${cardToCopy.description}`,
        listId: cardToCopy.listId,
        order: newOrder,
      },
    });
    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: EntityType.Card,
      action: Action.Create,
    });
  } catch (err) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error: 'Failed to copy card',
    };
  }

  revalidatePath(route('/board/[boardId]', { params: { boardId } }));
  return {
    type: ReturnTypeEnum.RESULT,
    data: card,
  };
};

const copyCard = createSafeAction(CopyCard, handler);

export default copyCard;
