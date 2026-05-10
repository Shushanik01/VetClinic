import { forwardRef } from 'react';

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <input
        {...props}
        ref={ref}
        className={`input-field w-full ${error ? 'input-error' : ''} ${className}`}
      />
    );
  }
);

TextInput.displayName = 'TextInput';
