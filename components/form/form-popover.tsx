'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { ElementRef, useRef } from 'react';
import { toast } from 'sonner';

import createBoard from '@/actions/create-board';

import { route } from '@/lib/route';

import { useAction } from '@/hooks/use-action';
import { useProModal } from '@/hooks/use-pro-modal';

import FormInput from '@/components/form/form-input';
import FormPicker from '@/components/form/form-picker';
import FormSubmit from '@/components/form/form-submit';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type FormPopoverProps = {
  children: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
};

const FormPopover = ({
  children,
  side = 'bottom',
  align,
  sideOffset = 0,
}: FormPopoverProps) => {
  const proModal = useProModal((state) => state);

  const router = useRouter();
  const closeRef = useRef<ElementRef<'button'>>(null);

  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      toast.success('Board created successfully.');
      closeRef.current?.click();
      router.push(route('/board/[boardId]', { params: { boardId: data.id } }));
    },
    onError: (error) => {
      toast.error(error);
      if (
        error ===
        'You have reached your limit of free boards. Please upgrade to create more.'
      ) {
        proModal.onOpen();
      }
    },
  });

  const onSubmit = async (formData: FormData) => {
    const title = formData.get('title') as string;
    const image = formData.get('image') as string;

    await execute({ title, image });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-80 pt-3"
        side={side}
        sideOffset={sideOffset}
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Create board
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-1 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormPicker id={'image'} errors={fieldErrors} />
            <FormInput
              id={'title'}
              label={'Board title'}
              type={'text'}
              errors={fieldErrors}
            />
          </div>
          <FormSubmit className="w-full">Create</FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default FormPopover;
