'use client';

import { CardWithList } from '@/type';
import { useQuery } from '@tanstack/react-query';

import { fetcher } from '@/lib/fetcher';
import { route } from '@/lib/route';

import { useCardModal } from '@/hooks/use-card-modal';

import Header, { HeaderSkeleton } from '@/components/modals/card-modal/header';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const CardModal = () => {
  const { id, isOpen, onClose } = useCardModal((state) => state);

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ['card', id],
    queryFn: () =>
      fetcher(route('/api/cards/[cardId]', { params: { cardId: id! } })),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {!cardData ? <HeaderSkeleton /> : <Header data={cardData} />}
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
