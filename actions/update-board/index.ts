'use server';

import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

import { UpdateBoard } from '@/actions/update-board/schema';
import { InputType, ReturnType } from '@/actions/update-board/types';

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

  const { title, id } = data;
  let board;

  try {
    board = await db.board.update({
      where: { id, orgId },
      data: { title },
    });
  } catch (err) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error: 'Failed to update board',
    };
  }

  revalidatePath(route('/board/[boardId]', { params: { boardId: board.id } }));
  return {
    type: ReturnTypeEnum.RESULT,
    data: board,
  };
};

const updateBoard = createSafeAction(UpdateBoard, handler);

export default updateBoard;
