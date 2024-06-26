import { Suspense } from 'react';

import { checkSubscription } from '@/lib/subscription';

import Info from '@/app/(platform)/(dashboard)/organization/[organizationId]/_components/info';
import ActivityList, {
  ActivityListSkeleton,
} from '@/app/(platform)/(dashboard)/organization/[organizationId]/activity/_components/activity-list';
import { Separator } from '@/components/ui/separator';

const ActivityPage = async () => {
  const isPro = await checkSubscription();

  return (
    <div className="w-full">
      <Info isPro={isPro} />
      <Separator className="my-2" />
      <Suspense fallback={<ActivityListSkeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  );
};

export default ActivityPage;
