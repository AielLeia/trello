'use server';

import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

import { CreateBoard } from '@/actions/create-board/schema';
import { InputType, ReturnType } from '@/actions/create-board/types';

import { createSafeAction, ReturnTypeEnum } from '@/lib/create-safe-action';
import db from '@/lib/db';
import { route } from '@/lib/route';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  if (!userId) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error: 'Unauthorized',
    };
  }

  const { title } = data;
  let board;

  try {
    board = await db.board.create({
      data: { title },
    });
  } catch (err) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error: 'Failed to create board',
    };
  }

  revalidatePath(route('/board/[boardId]', { params: { boardId: board.id } }));
  return {
    type: ReturnTypeEnum.RESULT,
    data: board,
  };
};

const createBoard = createSafeAction(CreateBoard, handler);

export default createBoard;
