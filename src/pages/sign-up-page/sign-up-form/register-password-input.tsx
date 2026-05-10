import { useState } from 'react';
import { passwordRules } from '~/utils/password-rules';
import Eye from '~/assets/svg/eye-regular.svg?react';
import EyeOff from '~/assets/svg/eye-closed.svg?react';

type RegisterPasswordInputProps =
  React.InputHTMLAttributes<HTMLInputElement> & {
    error?: boolean;
  };

export const RegisterPasswordInput = ({
  error,
  className,
  ...props
}: RegisterPasswordInputProps) => {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (props.onChange) props.onChange(e);
  };

  const hasValue = value.length > 0;
  const allValid = passwordRules.every((rule) => rule.test(value));
  const inputError = hasValue && (error || (touched && !allValid));

  return (
    <div className="relative w-full">
      <div className="relative w-full flex items-center">
        <input
          {...props}
          value={value}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          onFocus={() => setTouched(false)}
          type={show ? 'text' : 'password'}
          className={`input-field w-full ${inputError ? 'input-error' : ''} ${className}`}
        />

        {hasValue && (
          <button
            type="button"
            onClick={() => setShow(!show)}
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

      <ul className="mt-2 ml-4 list-disc space-y-0.5">
        {passwordRules.map((rule) => {
          const isValid = rule.test(value);
          const color =
            value.length === 0
              ? 'text-black-600'
              : isValid
                ? 'text-green-500'
                : 'text-red-500';
          return (
            <li key={rule.key} className={`text-sm ${color}`}>
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
