'use client';

import { CardWithList } from '@/type';
import { useQueryClient } from '@tanstack/react-query';
import { Layout } from 'lucide-react';
import { useParams } from 'next/navigation';
import { ElementRef, useRef, useState } from 'react';
import { toast } from 'sonner';

import updateCard from '@/actions/update-card';

import { useAction } from '@/hooks/use-action';

import FormInput from '@/components/form/form-input';
import { Skeleton } from '@/components/ui/skeleton';

type HeaderProps = {
  data: CardWithList;
};

const Header = ({ data }: HeaderProps) => {
  const queryClient = useQueryClient();
  const params = useParams();
  const inputRef = useRef<ElementRef<'input'>>(null);

  const [title, setTitle] = useState(data.title);

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit();
  };

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: async (dataSuccess) => {
      await queryClient.invalidateQueries({ queryKey: ['card', data.id] });
      await queryClient.invalidateQueries({ queryKey: ['card-logs', data.id] });
      toast.success(`Cards "${dataSuccess.title}" updated successfully.`);
      setTitle(data.title);
    },
    onError: (error) => toast.error(error),
  });

  const onSubmit = async (formData: FormData) => {
    const titleForm = formData.get('title') as string;
    const boardId = formData.get('boardId') as string;
    const id = formData.get('id') as string;

    if (titleForm === title) return;

    await execute({ title: titleForm, boardId, id });
  };

  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="h-5 w-5 mt-1 text-neutral-700" />
      <div className="w-full">
        <form action={onSubmit}>
          <FormInput
            ref={inputRef}
            id={'title'}
            defaultValue={title}
            onBlur={onBlur}
            className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
            errors={fieldErrors}
          />
          <input hidden defaultValue={params.boardId} name="boardId" />
          <input hidden defaultValue={data.id} name="id" />
        </form>
        <p className="text-sm text-muted-foreground">
          in list <span className="underline">{data.list.title}</span>
        </p>
      </div>
    </div>
  );
};

export const HeaderSkeleton = () => {
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
      <div>
        <Skeleton className="h-6 w-24 mb-1 bg-neutral-200" />
        <Skeleton className="h-4 w-12 mb-1 bg-neutral-200" />
      </div>
    </div>
  );
};

export default Header;
