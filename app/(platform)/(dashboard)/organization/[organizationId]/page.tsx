import { Suspense } from 'react';

import { checkSubscription } from '@/lib/subscription';

import BoardList, {
  BoardListSkeleton,
} from '@/app/(platform)/(dashboard)/organization/[organizationId]/_components/board-list';
import Info from '@/app/(platform)/(dashboard)/organization/[organizationId]/_components/info';
import { Separator } from '@/components/ui/separator';

const OrganizationIdPage = async () => {
  const isPro = await checkSubscription();

  return (
    <div className="w-full mb-20">
      <Info isPro={isPro} />
      <Separator className="my-4" />
      <div className="px-2 md:px-4">
        <Suspense fallback={<BoardListSkeleton />}>
          <BoardList />
        </Suspense>
      </div>
    </div>
  );
};

export default OrganizationIdPage;
