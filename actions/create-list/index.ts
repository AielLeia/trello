'use server';

import { auth } from '@clerk/nextjs';
import { Action, EntityType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { CreateList } from '@/actions/create-list/schema';
import { InputType, ReturnType } from '@/actions/create-list/types';

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

  const { title, boardId } = data;
  let list;

  try {
    const board = await db.board.findUnique({
      where: { id: boardId, orgId },
    });
    if (!board) {
      return {
        type: ReturnTypeEnum.GENERALE_ERROR,
        error: 'Board not found',
      };
    }

    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await db.list.create({
      data: { title, boardId, order: newOrder },
    });
    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: EntityType.List,
      action: Action.Create,
    });
  } catch (err) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error: 'Failed to create list',
    };
  }

  revalidatePath(route('/board/[boardId]', { params: { boardId } }));
  return {
    type: ReturnTypeEnum.RESULT,
    data: list,
  };
};

const createList = createSafeAction(CreateList, handler);

export default createList;
