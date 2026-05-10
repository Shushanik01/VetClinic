import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  act,
  fireEvent,
  renderWithProviders,
  screen,
  waitFor,
} from '~/__tests__';
import {
  fillSignUpForm,
  submitSignUpForm,
  VALID_SIGN_UP_FORM_DATA,
} from '~/__tests__/sign-up-form-helpers';
import { SignUpForm } from '~/pages/sign-up-page/sign-up-form/sign-up-form';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

const { mockNavigate, mockNotify } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockNotify: vi.fn(),
}));

const mockMutationState = vi.hoisted(() => ({
  isLoading: false,
}));

const mockVerifyState = vi.hoisted(() => ({
  shouldFail: false,
  errorMessage: 'Invalid or expired verification code.',
}));

vi.mock('~/app/providers/notifications', () => ({
  notify: mockNotify,
}));

vi.mock('~/store/api/auth/auth-api', async () => {
  const { authEntity } = await vi.importActual<
    typeof import('~/mocks/data/store/auth')
  >('~/mocks/data/store/auth');

  return {
    useSignUpMutation: () => {
      const mutation = (payload: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phoneNumber: string;
        captchaToken: string;
      }) => ({
        unwrap: async () => {
          if (payload.email.includes('network-fail')) {
            throw Object.assign(new Error('Network failure'), {
              error: 'Network failure',
            });
          }

          if (payload.email.includes('unknown-fail')) {
            throw new Error('Unknown error');
          }

          const result = authEntity.signUp(payload);

          if (result.status >= 400) {
            throw Object.assign(new Error('Sign up failed'), {
              data: result.body,
            });
          }

          return result.body;
        },
      });

      return [mutation, { isLoading: mockMutationState.isLoading }] as const;
    },

    useVerifyEmailMutation: () => {
      const mutation = (_payload: {
        email: string;
        verificationCode: string;
      }) => ({
        unwrap: async () => {
          if (mockVerifyState.shouldFail) {
            throw Object.assign(new Error(mockVerifyState.errorMessage), {
              data: { message: mockVerifyState.errorMessage },
            });
          }
          return { message: 'Email verified successfully.' };
        },
      });

      return [mutation, { isLoading: false }] as const;
    },

    useResendVerificationMutation: () => {
      const mutation = (_payload: { email: string }) => ({
        unwrap: async () => ({ message: 'Verification code resent.' }),
      });

      return [mutation, { isLoading: false }] as const;
    },
  };
});

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('~/components/captcha/captcha-input', async () => {
  const { useEffect } = await vi.importActual<typeof import('react')>('react');
  return {
    CaptchaInput: ({
      onVerify,
    }: {
      onVerify: (token: string | null) => void;
    }) => {
      useEffect(() => {
        onVerify('fake-captcha-token');
      }, []);
      return null;
    },
  };
});

describe('SignUpForm', () => {
  beforeEach(() => {
    mockMutationState.isLoading = false;
    mockVerifyState.shouldFail = false;
    mockVerifyState.errorMessage = 'Invalid or expired verification code.';
  });

  it('renders disabled submit button when form is invalid', () => {
    renderWithProviders(<SignUpForm />);

    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled();
  });

  it('trims first name on blur', () => {
    renderWithProviders(<SignUpForm />);

    const firstNameInput = screen.getByPlaceholderText('Enter First Name');

    fireEvent.change(firstNameInput, { target: { value: '   Jane   ' } });
    fireEvent.blur(firstNameInput);

    expect(firstNameInput).toHaveValue('Jane');
  });

  it('shows loading submit state when mutation is in progress', () => {
    mockMutationState.isLoading = true;

    renderWithProviders(<SignUpForm />);

    const submitButton = screen.getByRole('button', {
      name: /creating account/i,
    });

    expect(submitButton).toBeDisabled();
  });

  it('prevents default on Enter key for all navigation fields', () => {
    renderWithProviders(<SignUpForm />);

    const dispatchEnter = (placeholder: string) => {
      const input = screen.getByPlaceholderText(placeholder);
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true,
        cancelable: true,
      });

      return input.dispatchEvent(event);
    };

    expect(dispatchEnter('Enter First Name')).toBe(false);
    expect(dispatchEnter('Enter Last Name')).toBe(false);
    expect(dispatchEnter('Enter your Email')).toBe(false);
    expect(dispatchEnter('+38(___) ___-__-__')).toBe(false);
    expect(dispatchEnter('Enter your Password')).toBe(false);
  });

  it('shows mismatch error when confirm password does not match', async () => {
    renderWithProviders(<SignUpForm />);

    fireEvent.change(screen.getByPlaceholderText('Enter your Password'), {
      target: { value: VALID_SIGN_UP_FORM_DATA.password },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your Password'), {
      target: { value: 'DifferentPass1!' },
    });

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });

  it('shows validation errors for invalid first name, last name, email and phone', async () => {
    renderWithProviders(<SignUpForm />);

    const firstName = screen.getByPlaceholderText('Enter First Name');
    const lastName = screen.getByPlaceholderText('Enter Last Name');
    const email = screen.getByPlaceholderText('Enter your Email');
    const phone = screen.getByPlaceholderText('+38(___) ___-__-__');

    fireEvent.change(firstName, { target: { value: 'John@' } });
    fireEvent.blur(firstName);

    fireEvent.change(lastName, { target: { value: 'Doe@' } });
    fireEvent.blur(lastName);

    fireEvent.change(email, { target: { value: 'wrong-email' } });
    fireEvent.blur(email);

    fireEvent.change(phone, { target: { value: '+00012345678' } });
    fireEvent.blur(phone);

    await waitFor(() => {
      expect(
        screen.getByText(
          'First name must be up to 50 characters. Only Latin letters, hyphens, and apostrophes are allowed.'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Last name must be up to 50 characters. Only Latin letters, hyphens, spaces and apostrophes are allowed.'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Invalid email address. Please ensure it follows the format: username@domain.com'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText('Invalid phone number or country code')
      ).toBeInTheDocument();
    });
  });

  it('transitions to the verification step after successful sign-up', async () => {
    renderWithProviders(<SignUpForm />);

    fillSignUpForm({
      email: `new-user-${Date.now()}@vetcare.dev`,
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeEnabled();
    });

    submitSignUpForm();

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          description: 'Verification code sent to your email.',
        })
      );
      expect(
        screen.getByTestId('verification-step-heading')
      ).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows API error notification when email already exists', async () => {
    renderWithProviders(<SignUpForm />);

    fillSignUpForm({
      email: 'client@vetcare.dev',
      firstName: 'Existing',
      lastName: 'User',
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeEnabled();
    });

    submitSignUpForm();

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          description: 'A user with this email already exists.',
        })
      );
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('uses err.error message when request fails without data.message', async () => {
    renderWithProviders(<SignUpForm />);

    fillSignUpForm({
      email: 'network-fail@vetcare.dev',
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeEnabled();
    });

    submitSignUpForm();

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          description: 'Network failure',
        })
      );
    });
  });

  it('uses fallback error message when request fails with unknown shape', async () => {
    renderWithProviders(<SignUpForm />);

    fillSignUpForm({
      email: 'unknown-fail@vetcare.dev',
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeEnabled();
    });

    submitSignUpForm();

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          description: 'Something went wrong',
        })
      );
    });
  });

  describe('verification step', () => {
    let testEmail: string;

    const advanceToVerificationStep = async () => {
      testEmail = `verify-${Date.now()}-${Math.random().toString(36).slice(2)}@vetcare.dev`;
      renderWithProviders(<SignUpForm />);
      fillSignUpForm({ email: testEmail });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /continue/i })).toBeEnabled();
      });

      submitSignUpForm();

      await waitFor(() => {
        expect(
          screen.getByTestId('verification-step-heading')
        ).toBeInTheDocument();
      });
    };

    it('shows the email the code was sent to', async () => {
      await advanceToVerificationStep();

      expect(screen.getByTestId('pending-email')).toHaveTextContent(testEmail);
    });

    it('has the Continue button disabled when no code is entered', async () => {
      await advanceToVerificationStep();

      expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled();
    });

    it('enables the Continue button after entering a code', async () => {
      await advanceToVerificationStep();

      fireEvent.change(screen.getByPlaceholderText('Enter Verification Code'), {
        target: { value: '123456' },
      });

      expect(screen.getByRole('button', { name: /continue/i })).toBeEnabled();
    });

    it('shows a success notification and navigates to login on valid code', async () => {
      await advanceToVerificationStep();

      fireEvent.change(screen.getByPlaceholderText('Enter Verification Code'), {
        target: { value: '123456' },
      });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(mockNotify).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'success',
            description: 'Email verified successfully.',
          })
        );
      });

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES_PATH.LOGIN);
    });

    it('shows an error message when the verification code is rejected', async () => {
      mockVerifyState.shouldFail = true;
      mockVerifyState.errorMessage = 'Invalid or expired verification code.';

      await advanceToVerificationStep();

      fireEvent.change(screen.getByPlaceholderText('Enter Verification Code'), {
        target: { value: 'wrong' },
      });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(
          screen.getByText('Invalid or expired verification code.')
        ).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('clears the error message when the user types a new code', async () => {
      mockVerifyState.shouldFail = true;

      await advanceToVerificationStep();

      const codeInput = screen.getByPlaceholderText('Enter Verification Code');

      fireEvent.change(codeInput, { target: { value: 'wrong' } });
      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(
          screen.getByText('Invalid or expired verification code.')
        ).toBeInTheDocument();
      });

      fireEvent.change(codeInput, { target: { value: 'newcode' } });

      expect(
        screen.queryByText('Invalid or expired verification code.')
      ).not.toBeInTheDocument();
    });

    it('returns to the register step when Change email is clicked', async () => {
      await advanceToVerificationStep();

      fireEvent.click(screen.getByRole('button', { name: /change email/i }));

      expect(
        screen.getByPlaceholderText('Enter First Name')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('verification-step-heading')
      ).not.toBeInTheDocument();
    });

    it('shows a success notification when resending the verification code', async () => {
      vi.useFakeTimers();

      try {
        const email = `resend-${Math.random().toString(36).slice(2)}@vetcare.dev`;
        renderWithProviders(<SignUpForm />);
        fillSignUpForm({ email });

        // Flush RHF validation effects so the button becomes enabled
        await act(async () => {});

        expect(screen.getByRole('button', { name: /continue/i })).toBeEnabled();

        fireEvent.click(screen.getByRole('button', { name: /continue/i }));

        // Flush the sign-up async mutation (mock has no delay)
        await act(async () => {});

        expect(
          screen.getByTestId('verification-step-heading')
        ).toBeInTheDocument();

        // Advance past the 59-second countdown — each tick re-renders React,
        // so we step 1 second at a time inside act
        for (let i = 0; i < 60; i++) {
          await act(async () => {
            vi.advanceTimersByTime(1_000);
          });
        }

        expect(
          screen.getByRole('button', { name: /resend code/i })
        ).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /resend code/i }));

        // Flush the resend mutation
        await act(async () => {});

        expect(mockNotify).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'success',
            description: 'Verification code resent successfully.',
          })
        );
      } finally {
        vi.useRealTimers();
      }
    });
  });
});
