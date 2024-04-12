import { Suspense } from 'react';

import Info from '@/app/(platform)/(dashboard)/organization/[organizationId]/_components/info';
import ActivityList, {
  ActivityListSkeleton,
} from '@/app/(platform)/(dashboard)/organization/[organizationId]/activity/_components/activity-list';
import { Separator } from '@/components/ui/separator';

const ActivityPage = () => {
  return (
    <div className="w-full">
      <Info />
      <Separator className="my-2" />
      <Suspense fallback={<ActivityListSkeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  );
};

export default ActivityPage;
