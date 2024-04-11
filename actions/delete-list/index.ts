'use server';

import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

import { DeleteList } from '@/actions/delete-list/schema';
import { InputType, ReturnType } from '@/actions/delete-list/types';

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
  let list;

  try {
    list = await db.list.delete({
      where: { id, boardId, board: { orgId } },
    });
  } catch (err) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error: 'Failed to delete board',
    };
  }

  revalidatePath(route('/board/[boardId]', { params: { boardId } }));
  return {
    type: ReturnTypeEnum.RESULT,
    data: list,
  };
};

const deleteBoard = createSafeAction(DeleteList, handler);

export default deleteBoard;
