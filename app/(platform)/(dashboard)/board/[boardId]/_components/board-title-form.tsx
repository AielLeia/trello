'use client';

import { Board } from '@prisma/client';
import { ElementRef, useRef, useState } from 'react';
import { toast } from 'sonner';

import updateBoard from '@/actions/update-board';

import { useAction } from '@/hooks/use-action';

import FormInput from '@/components/form/form-input';
import { Button } from '@/components/ui/button';

type BoardTitleFormProps = {
  data: Board;
};

const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
  const { execute } = useAction(updateBoard, {
    onSuccess: (dataSuccess) => {
      toast.success(`Board "${dataSuccess.title}" updated"`);
      setTitle(dataSuccess.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);

  const [title, setTitle] = useState(data.title);
  const [isEditing, setEditing] = useState(false);

  const disableEditing = () => setEditing(false);
  const enableEditing = () => {
    setEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  const onSubmit = async (formData: FormData) => {
    const title = formData.get('title') as string;
    if (title === data.title) return;

    await execute({ title, id: data.id });
  };

  if (isEditing) {
    return (
      <form
        action={onSubmit}
        ref={formRef}
        className="flex items-center gap-x-2"
      >
        <FormInput
          ref={inputRef}
          id={'title'}
          onBlur={onBlur}
          defaultValue={title}
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>
    );
  }

  return (
    <Button
      onClick={enableEditing}
      variant="transparent"
      className="font-bold text-lg h-auto w-auto p-1 px-2"
    >
      {title}
    </Button>
  );
};

export default BoardTitleForm;
