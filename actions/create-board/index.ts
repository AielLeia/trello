'use server';

import { auth } from '@clerk/nextjs';
import { Action, EntityType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { CreateBoard } from '@/actions/create-board/schema';
import { InputType, ReturnType } from '@/actions/create-board/types';

import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction, ReturnTypeEnum } from '@/lib/create-safe-action';
import db from '@/lib/db';
import { hasAvailableCount, incrementAvailableCount } from '@/lib/org-limit';
import { route } from '@/lib/route';
import { checkSubscription } from '@/lib/subscription';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error: 'Unauthorized',
    };
  }

  const canCreate = await hasAvailableCount();
  const isPro = await checkSubscription();
  if (!canCreate && !isPro) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error:
        'You have reached your limit of free boards. Please upgrade to create more.',
    };
  }

  const { title, image } = data;
  const [imageId, imageThumbUrl, imageFullUrl, imageUsername, imageLinkHTML] =
    image.split('|');
  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageUsername ||
    !imageLinkHTML
  ) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error: 'Missing fields. Failed to create board.',
    };
  }

  let board;
  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUsername,
        imageLinkHTML,
      },
    });
    if (!isPro) {
      await incrementAvailableCount();
    }
    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: EntityType.Board,
      action: Action.Create,
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
