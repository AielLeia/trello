'use client';

import { toast } from 'sonner';

import stripeRedirect from '@/actions/stripe-redirect';

import { useAction } from '@/hooks/use-action';
import { useProModal } from '@/hooks/use-pro-modal';

import { Button } from '@/components/ui/button';

type SubscriptionButtonProps = {
  isPro: boolean;
};

const SubscriptionButton = ({ isPro }: SubscriptionButtonProps) => {
  const proModal = useProModal((state) => state);
  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (data) => {
      toast.error(data);
    },
  });

  const onClick = async () => {
    if (isPro) {
      await execute({});
    } else {
      proModal.onOpen();
    }
  };

  return (
    <Button onClick={onClick} disabled={isLoading} variant="primary">
      {isPro ? 'Manage subscription' : 'Update Subscription'}
    </Button>
  );
};

export default SubscriptionButton;
