'use server';

import { auth } from '@clerk/nextjs';
import { Action, EntityType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { UpdateList } from '@/actions/update-list/schema';
import { InputType, ReturnType } from '@/actions/update-list/types';

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

  const { title, id, boardId } = data;
  let list;

  try {
    list = await db.list.update({
      where: { id, boardId, board: { orgId } },
      data: { title },
    });
    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: EntityType.List,
      action: Action.Update,
    });
  } catch (err) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error: 'Failed to update list',
    };
  }

  revalidatePath(route('/board/[boardId]', { params: { boardId: boardId } }));
  return {
    type: ReturnTypeEnum.RESULT,
    data: list,
  };
};

const updateList = createSafeAction(UpdateList, handler);

export default updateList;
