import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import db from '@/lib/db';
import { route } from '@/lib/route';

import ActivityItem from '@/components/activity-item';
import { Skeleton } from '@/components/ui/skeleton';

const ActivityList = async () => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    return redirect(route('/select-org'));
  }

  const auditLogs = await db.auditLog.findMany({
    where: { orgId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <ol className="space-y-4 mt-4">
      <p className="hidden last:block text-xs text-center text-muted-foreground">
        No activity found inside this organization.
      </p>
      {auditLogs.map((log) => (
        <ActivityItem key={log.id} data={log} />
      ))}
    </ol>
  );
};

export const ActivityListSkeleton = async () => {
  return (
    <ol className="space-y-4 mt-4">
      <Skeleton className="h-14 w-[80%] bg-neutral-200" />
      <Skeleton className="h-14 w-[50%] bg-neutral-200" />
      <Skeleton className="h-14 w-[70%] bg-neutral-200" />
      <Skeleton className="h-14 w-[60%] bg-neutral-200" />
      <Skeleton className="h-14 w-[40%] bg-neutral-200" />
    </ol>
  );
};

export default ActivityList;
