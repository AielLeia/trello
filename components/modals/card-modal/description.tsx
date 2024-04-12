'use client';

import { CardWithList } from '@/type';
import { useQueryClient } from '@tanstack/react-query';
import { AlignLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { ElementRef, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';

import updateCard from '@/actions/update-card';

import { useAction } from '@/hooks/use-action';

import FormSubmit from '@/components/form/form-submit';
import FormTextarea from '@/components/form/form-textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type DescriptionProps = {
  data: CardWithList;
};

const Description = ({ data }: DescriptionProps) => {
  const queryClient = useQueryClient();
  const params = useParams();

  const [isEditing, setIsEditing] = useState(false);

  const textareaRef = useRef<ElementRef<'textarea'>>(null);
  const formRef = useRef<ElementRef<'form'>>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };
  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      disableEditing();
    }
  };

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (dataSuccess) => {
      queryClient.invalidateQueries({ queryKey: ['card', data.id] });
      toast.success(
        `Card description for "${dataSuccess.title}" updated successfully.`
      );
      disableEditing();
    },
    onError: (error) => toast.error(error),
  });

  useEventListener('keydown', onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const onSubmit = async (formData: FormData) => {
    const description = formData.get('description') as string;
    const boardId = formData.get('boardId') as string;
    const id = formData.get('id') as string;

    await execute({ description, boardId, id });
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-1.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Description</p>
        {isEditing ? (
          <form action={onSubmit} ref={formRef} className="space-y-2">
            <FormTextarea
              ref={textareaRef}
              id={'description'}
              className="w-full mt-2"
              placeholder="Add a more detailed description..."
              defaultValue={data.description || undefined}
              errors={fieldErrors}
            />
            <input hidden defaultValue={params.boardId} name="boardId" />
            <input hidden defaultValue={data.id} name="id" />
            <div className="flex items-center gap-x-2">
              <FormSubmit>Save</FormSubmit>
              <Button
                type="button"
                onClick={disableEditing}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
          >
            {data.description || 'Add a more detailed description...'}
          </div>
        )}
      </div>
    </div>
  );
};

export const DescriptionSkeleton = () => {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] bg-neutral-200" />
      </div>
    </div>
  );
};

export default Description;
