import { List } from '@prisma/client';
import { ElementRef, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useEventListener } from 'usehooks-ts';

import updateList from '@/actions/update-list';

import { useAction } from '@/hooks/use-action';

import ListOptions from '@/app/(platform)/(dashboard)/board/[boardId]/_components/list-options';
import FormInput from '@/components/form/form-input';

type ListHeaderProps = {
  data: List;
};

const ListHeader = ({ data }: ListHeaderProps) => {
  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);

  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };
  const disableEditing = () => {
    setIsEditing(false);
  };

  const { execute, fieldErrors } = useAction(updateList, {
    onSuccess: (dataSuccess) => {
      toast.success(`Renamed to "${dataSuccess.title}"`);
      setTitle(dataSuccess.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      formRef.current?.requestSubmit();
    }
  };

  const onSubmit = async (formData: FormData) => {
    const title = formData.get('title') as string;
    const boardId = formData.get('boardId') as string;
    const id = formData.get('id') as string;

    if (title === data.title) return;

    await execute({ title, boardId, id });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  useEventListener('keydown', onKeyDown);

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      {isEditing ? (
        <form action={onSubmit} ref={formRef} className="flex-1 px-[2px]">
          <input hidden id="id" name="id" defaultValue={data.id} />
          <input
            hidden
            id="boardId"
            name="boardId"
            defaultValue={data.boardId}
          />
          <FormInput
            id={'title'}
            ref={inputRef}
            onBlur={onBlur}
            placeholder={'Enter list title'}
            errors={fieldErrors}
            defaultValue={title}
            className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
          />
          <button hidden type="submit" />
        </form>
      ) : (
        <div
          className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
          onClick={enableEditing}
        >
          {data.title}
        </div>
      )}
      <ListOptions data={data} onAddCard={() => {}} />
    </div>
  );
};

export default ListHeader;
