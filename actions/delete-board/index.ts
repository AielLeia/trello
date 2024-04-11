'use server';

import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { DeleteBoard } from '@/actions/delete-board/schema';
import { InputType, ReturnType } from '@/actions/delete-board/types';

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

  const { id } = data;

  try {
    await db.board.delete({
      where: { id, orgId },
    });
  } catch (err) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error: 'Failed to delete board',
    };
  }

  const organizationUrl = route('/organization/[organizationId]', {
    params: { organizationId: orgId },
  });
  revalidatePath(organizationUrl);
  redirect(organizationUrl);
};

const deleteBoard = createSafeAction(DeleteBoard, handler);

export default deleteBoard;
