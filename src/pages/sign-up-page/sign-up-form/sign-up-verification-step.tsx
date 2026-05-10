import { VerificationCodeInput } from '~/components/forms/verification-code-input';

type SignUpVerificationStepProps = {
  email: string;
  verificationCode: string;
  verificationCodeError: string;
  isLoading: boolean;
  canVerify: boolean;
  onCodeChange: (value: string) => void;
  onResend: () => void;
  onSubmit: () => void;
  onChangeEmail: () => void;
};

export const SignUpVerificationStep = ({
  email,
  verificationCode,
  verificationCodeError,
  isLoading,
  canVerify,
  onCodeChange,
  onResend,
  onSubmit,
  onChangeEmail,
}: SignUpVerificationStepProps) => {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-8 md:p-10 lg:p-12 bg-neutral-0 rounded-4xl">
      <div className="flex flex-col gap-1 mb-6 w-full">
        <h1
          data-testid="verification-step-heading"
          className="text-[28px] font-medium text-black-900"
        >
          Enter Verification Code
        </h1>
        <p className="text-base text-black-800">
          The verification code has been sent to your email to{' '}
          <span data-testid="pending-email" className="font-semibold">
            {email}
          </span>
          .
        </p>
        <button
          type="button"
          className="text-blue-600 underline decoration-blue-600 cursor-pointer w-fit mt-2"
          onClick={onChangeEmail}
        >
          Change email
        </button>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-6 w-full"
      >
        <VerificationCodeInput
          value={verificationCode}
          onChange={onCodeChange}
          onResend={onResend}
          error={verificationCodeError}
          isLoading={isLoading}
        />

        <button
          type="submit"
          disabled={!canVerify}
          className="btn-regular-l w-full"
        >
          {isLoading ? 'Verifying...' : 'Continue'}
        </button>
      </form>
    </div>
  );
};
