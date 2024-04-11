'use client';

import { forwardRef, KeyboardEventHandler } from 'react';
import { useFormStatus } from 'react-dom';

import { cn } from '@/lib/utils';

import FormErrors from '@/components/form/form-errors';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type FormTextareaProps = {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
  onClick?: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
};

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ id, label, errors, ...props }, ref) => {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-2 w-full">
        <div className="space-y-1 w-full">
          {label ? (
            <Label
              htmlFor={id}
              className="text-xs font-semibold text-neutral-700"
            >
              {label}
            </Label>
          ) : null}
          <Textarea
            ref={ref}
            id={id}
            name={id}
            {...props}
            className={cn(
              'resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm',
              props.className
            )}
            aria-describedby={`${id}-error`}
            defaultValue={props.defaultValue}
            disabled={props.disabled || pending}
            onKeyDown={props.onKeyDown}
          />
          <FormErrors id={id} errors={errors} />
        </div>
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
