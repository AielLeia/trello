'use client';

import { CardWithList } from '@/type';
import { useQueryClient } from '@tanstack/react-query';
import { Copy, Trash } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import copyCard from '@/actions/copy-card';
import deleteCard from '@/actions/delete-card';

import { useAction } from '@/hooks/use-action';
import { useCardModal } from '@/hooks/use-card-modal';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type ActionsProps = {
  data: CardWithList;
};

const Actions = ({ data }: ActionsProps) => {
  const { onClose } = useCardModal((state) => state);

  const queryClient = useQueryClient();
  const params = useParams();

  const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(
    copyCard,
    {
      onSuccess: (dataSuccess) => {
        queryClient.invalidateQueries({ queryKey: ['card', data.id] });
        toast.success(`Card "${dataSuccess.title}" copied successfully.`);
      },
      onError: (error) => toast.error(error),
    }
  );

  const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: (dataSuccess) => {
        queryClient.invalidateQueries({ queryKey: ['card', data.id] });
        toast.success(`Card "${dataSuccess.title}" deleted successfully.`);
        onClose();
      },
      onError: (error) => toast.error(error),
    }
  );

  const onCopyCard = async () => {
    const boardId = params.boardId as string;
    const id = data.id;

    await executeCopyCard({ id, boardId });
  };

  const onDeleteCard = async () => {
    const boardId = params.boardId as string;
    const id = data.id;

    await executeDeleteCard({ id, boardId });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        onClick={onCopyCard}
        variant="gray"
        className="w-full justify-start"
        size="inline"
        disabled={isLoadingCopy}
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button
        onClick={onDeleteCard}
        variant="gray"
        className="w-full justify-start"
        size="inline"
        disabled={isLoadingDelete}
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

export const ActionsSkeleton = () => {
  return (
    <div className="space-y-2 my-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};

export default Actions;
