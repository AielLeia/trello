'use client';

import { Plus, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { ElementRef, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';

import createList from '@/actions/create-list';

import { useAction } from '@/hooks/use-action';

import ListWrapper from '@/app/(platform)/(dashboard)/board/[boardId]/_components/list-wrapper';
import FormInput from '@/components/form/form-input';
import FormSubmit from '@/components/form/form-submit';
import { Button } from '@/components/ui/button';

const ListForm = () => {
  const router = useRouter();
  const params = useParams();

  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);

  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
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

  const { execute, fieldErrors } = useAction(createList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" created successfully.`);
      disableEditing();
      router.refresh();
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const onSubmit = async (formData: FormData) => {
    const title = formData.get('title') as string;
    const boardId = formData.get('boardId') as string;

    await execute({ title, boardId });
  };

  useEventListener('keydown', onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          action={onSubmit}
          ref={formRef}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
        >
          <FormInput
            ref={inputRef}
            errors={fieldErrors}
            id={'title'}
            className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
            placeholder={'Enter list title'}
          />
          <input hidden defaultValue={params.boardId} name="boardId" />
          <div className="flex items-center justify-between gap-x-1">
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="h-5 w-5" />
            </Button>
            <FormSubmit>Add List</FormSubmit>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        onClick={enableEditing}
        className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a list
      </button>
    </ListWrapper>
  );
};

export default ListForm;
