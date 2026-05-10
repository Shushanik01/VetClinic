import { forwardRef, useState } from 'react';
import Eye from '~/assets/svg/eye-regular.svg?react';
import EyeOff from '~/assets/svg/eye-closed.svg?react';

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ error, className, onChange, ...props }, ref) => {
    const [show, setShow] = useState(false);
    const [value, setValue] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      if (onChange) {
        onChange(event);
      }
    };

    const hasValue = value.length > 0;

    return (
      <div className="relative w-full">
        <div className="relative w-full flex items-center">
          <input
            {...props}
            ref={ref}
            value={value}
            onChange={handleChange}
            type={show ? 'text' : 'password'}
            className={`input-field w-full ${error ? 'input-error' : ''} ${className ?? ''}`}
          />

          {hasValue && (
            <button
              type="button"
              onClick={() => setShow((prev) => !prev)}
              className="absolute right-4 h-full flex items-center cursor-pointer text-black-700 hover:text-black-900"
            >
              {show ? (
                <EyeOff width={20} height={20} />
              ) : (
                <Eye width={20} height={20} />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput'; // NOSONAR
