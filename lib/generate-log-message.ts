import { Action, AuditLog } from '@prisma/client';

export const generateLogMessage = (log: AuditLog) => {
  const { action, entityType, entityTitle } = log;
  switch (action) {
    case Action.Create:
      return `created ${entityType.toLowerCase()} "${entityTitle}"`;
    case Action.Update:
      return `updated ${entityType.toLowerCase()} "${entityTitle}"`;
    case Action.Delete:
      return `delete ${entityType.toLowerCase()} "${entityTitle}"`;
    default:
      return `unknown action ${entityType.toLowerCase()} "${entityTitle}"`;
  }
};
