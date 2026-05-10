type TextAreaInputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

export const TextAreaInput = ({
  error,
  className,
  ...props
}: TextAreaInputProps) => {
  return (
    <textarea
      {...props}
      className={`input-field w-full resize-none ${error ? 'input-error' : ''} ${className}`}
    />
  );
};
