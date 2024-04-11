import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import db from '@/lib/db';
import { route } from '@/lib/route';

import ListContainer from '@/app/(platform)/(dashboard)/board/[boardId]/_components/list-container';

type BoardIdPageProps = {
  params: {
    boardId: string;
  };
};

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    return redirect(route('/select-org'));
  }

  const lists = await db.list.findMany({
    where: {
      boardId: params.boardId,
      board: {
        orgId,
      },
    },
    include: {
      card: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: {
      order: 'asc',
    },
  });

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer boardId={params.boardId} data={lists} />
    </div>
  );
};

export default BoardIdPage;
