type FormFieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
};

export const FormField = ({
  label,
  required,
  error,
  hint,
  htmlFor,
  className,
  children,
}: FormFieldProps) => {
  let helperText: React.ReactNode = null;

  if (error) {
    helperText = <p className="input-caption text-red-400 mt-1">{error}</p>;
  } else if (hint) {
    helperText = <p className="text-xs text-black-600 mt-1">{hint}</p>;
  }

  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="input-label flex items-center ">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>

      <div className="mt-2">{children}</div>

      {helperText}
    </div>
  );
};
