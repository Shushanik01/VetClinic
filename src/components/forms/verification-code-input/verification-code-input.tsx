import { useEffect, useState } from 'react';
import { FormField } from '~/components/forms/form-field';
import { TextInput } from '~/components/forms/text-input';

type VerificationCodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  onResend: () => void;
  error?: string;
  isLoading?: boolean;
  className?: string;
};

export const VerificationCodeInput = ({
  value,
  onChange,
  onResend,
  error,
  isLoading,
  className,
}: VerificationCodeInputProps) => {
  const [secondsRemaining, setSecondsRemaining] = useState(59);
  const [isCountdownActive, setIsCountdownActive] = useState(true);

  useEffect(() => {
    if (!isCountdownActive || secondsRemaining <= 0) {
      if (secondsRemaining <= 0) {
        setIsCountdownActive(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsRemaining, isCountdownActive]);

  const handleResend = () => {
    setSecondsRemaining(59);
    setIsCountdownActive(true);
    onResend();
  };

  return (
    <div className={`flex flex-col gap-4 ${className ?? ''}`}>
      <FormField
        label="Verification Code"
        required
        htmlFor="verification-code"
        error={error}
        hint="Enter the code sent to your email"
        className="w-full max-w-[552px]"
      >
        <TextInput
          id="verification-code"
          placeholder="Enter Verification Code"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          className="max-w-[552px]"
        />
      </FormField>

      <div className="flex items-center justify-between text-sm">
        {isCountdownActive ? (
          <span className="text-black-600">
            Resend in {secondsRemaining} seconds
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className="text-blue-600 underline decoration-blue-600 cursor-pointer hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-regular text-sm"
          >
            Resend code
          </button>
        )}
      </div>
    </div>
  );
};
