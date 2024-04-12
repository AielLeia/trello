import { auth, currentUser } from '@clerk/nextjs';
import { Action, EntityType } from '@prisma/client';

import db from '@/lib/db';

type CreateAuditLogProps = {
  entityId: string;
  entityType: EntityType;
  entityTitle: string;
  action: Action;
};

export const createAuditLog = async ({
  entityId,
  entityTitle,
  entityType,
  action,
}: CreateAuditLogProps) => {
  try {
    const { orgId } = auth();
    const user = await currentUser();
    if (!user || !orgId) {
      throw new Error('User not found');
    }

    await db.auditLog.create({
      data: {
        entityId,
        entityTitle,
        entityType,
        action,
        orgId,
        userId: user.id,
        username: user?.firstName + ' ' + user?.lastName,
        userImage: user?.imageUrl,
      },
    });
  } catch (err) {
    console.error('[AUDIT_LOG_ERROR]', err, {
      entityId,
      entityTitle,
      entityType,
      action,
    });
  }
};
