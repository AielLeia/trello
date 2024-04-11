'use client';

import { Plus, X } from 'lucide-react';
import { ElementRef, forwardRef, KeyboardEventHandler, useRef } from 'react';
import { toast } from 'sonner';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';

import createCard from '@/actions/create-card';

import { useAction } from '@/hooks/use-action';

import FormSubmit from '@/components/form/form-submit';
import FormTextarea from '@/components/form/form-textarea';
import { Button } from '@/components/ui/button';

type CardFormProps = {
  listId: string;
  boardId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
};

const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, boardId, isEditing, enableEditing, disableEditing }, ref) => {
    const formRef = useRef<ElementRef<'form'>>(null);

    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" created successfully.`);
        formRef.current?.reset();
      },
      onError: (err) => {
        toast.error(err);
      },
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        disableEditing();
      }
    };

    const onSubmit = async (formData: FormData) => {
      const title = formData.get('title') as string;
      const boardId = formData.get('boardId') as string;
      const listId = formData.get('listId') as string;

      await execute({ title, boardId, listId });
    };

    useOnClickOutside(formRef, disableEditing);
    useEventListener('keydown', onKeyDown);

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    if (isEditing) {
      return (
        <form
          ref={formRef}
          action={onSubmit}
          className="m-1 py-0.5 px-1 space-y-4"
        >
          <FormTextarea
            id={'title'}
            onKeyDown={onTextareaKeyDown}
            errors={fieldErrors}
            ref={ref}
            placeholder="Enter a title for this card..."
          />
          <input hidden id="listId" name="listId" defaultValue={listId} />
          <input hidden id="boardId" name="boardId" defaultValue={boardId} />
          <div className="flex items-center justify-between">
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="h-4 w-4 mr-2" />
            </Button>
            <FormSubmit>Add card</FormSubmit>
          </div>
        </form>
      );
    }

    return (
      <div className="pt-2 px-2">
        <Button
          onClick={enableEditing}
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
          size="sm"
          variant="ghost"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = 'CardForm';

export default CardForm;
