import { XCircle } from 'lucide-react';

type FormErrorsProps = {
  id: string;
  errors?: Record<string, string[] | undefined>;
};

const FormErrors = ({ id, errors }: FormErrorsProps) => {
  if (!errors) return null;

  return (
    <div
      id={`${id}-error`}
      aria-live="polite"
      className="mt-2 text-xs text-rose-500"
    >
      {errors?.[id]?.map((error, index) => (
        <div
          key={index}
          className="flex items-center font-medium p-2 border border-rose-700 bg-rose-500/10 rounded-md"
        >
          <XCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      ))}
    </div>
  );
};

export default FormErrors;
