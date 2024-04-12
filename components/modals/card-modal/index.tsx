'use client';

import { CardWithList } from '@/type';
import { AuditLog } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

import { fetcher } from '@/lib/fetcher';
import { route } from '@/lib/route';

import { useCardModal } from '@/hooks/use-card-modal';

import Actions, {
  ActionsSkeleton,
} from '@/components/modals/card-modal/actions';
import Activity, {
  ActivitySkeleton,
} from '@/components/modals/card-modal/activity';
import Description, {
  DescriptionSkeleton,
} from '@/components/modals/card-modal/description';
import Header, { HeaderSkeleton } from '@/components/modals/card-modal/header';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const CardModal = () => {
  const { id, isOpen, onClose } = useCardModal((state) => state);

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ['card', id],
    queryFn: () =>
      fetcher(route('/api/cards/[cardId]', { params: { cardId: id! } })),
  });

  const { data: auditLogsData } = useQuery<AuditLog[]>({
    queryKey: ['card-logs', id],
    queryFn: () =>
      fetcher(
        route('/api/cards/[cardId]/audit-logs', { params: { cardId: id! } })
      ),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {!cardData ? <HeaderSkeleton /> : <Header data={cardData} />}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData ? (
                <DescriptionSkeleton />
              ) : (
                <Description data={cardData} />
              )}
              {!auditLogsData ? (
                <ActivitySkeleton />
              ) : (
                <Activity items={auditLogsData} />
              )}
            </div>
          </div>
          {!cardData ? <ActionsSkeleton /> : <Actions data={cardData} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
