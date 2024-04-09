'use client';

import createBoard from '@/actions/create-board';

import { useAction } from '@/hooks/use-action';

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
      <input
        id="title"
        type="text"
        name="title"
        required
        placeholder="Enter the board title"
        className="p-3 border border-gray-300 rounded-lg"
      />
      {fieldErrors && JSON.stringify(fieldErrors)}
    </form>
  );
};

export default OrganizationIdPage;
