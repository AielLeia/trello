'use client';

import createBoard from '@/actions/create-board';

import { useAction } from '@/hooks/use-action';

import FormInput from '@/components/form/form-input';
import FormSubmit from '@/components/form/form-submit';

const OrganizationIdPage = () => {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => console.log(data),
    onError: (error) => console.log(error),
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;

    execute({ title });
  };

  return (
    <form action={onSubmit}>
      <FormInput
        errors={fieldErrors}
        id="title"
        type="text"
        label="Board title"
      />
      <FormSubmit>Save</FormSubmit>
    </form>
  );
};

export default OrganizationIdPage;
