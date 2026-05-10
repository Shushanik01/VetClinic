import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  act,
  fireEvent,
  renderWithProviders,
  screen,
  waitFor,
} from '~/__tests__';
import { fillSignInForm } from '~/__tests__/sign-in-form-helpers';
import { SignInForm } from '~/pages/sign-in-page/sign-in-form/sign-in-form';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

const { mockNavigate, mockNotify, mockDispatch } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockNotify: vi.fn(),
  mockDispatch: vi.fn(),
}));

const mockMutationState = vi.hoisted(() => ({
  isLoading: false,
}));

const mockRecoveryConfig = vi.hoisted(() => ({
  requestShouldFail: false,
  requestError: { data: { message: 'Recovery request failed.' } },
  resetShouldFail: false,
  resetError: { data: { message: 'Password reset failed.' } },
}));

vi.mock('~/app/providers/notifications', () => ({
  notify: mockNotify,
}));

vi.mock('react-redux', async () => {
  const actual =
    await vi.importActual<typeof import('react-redux')>('react-redux');

  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: vi.fn(),
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
    useLocation: () => ({ state: null }),
  };
});

vi.mock('~/store/api/auth/auth-api', async () => {
  const { authEntity } = await vi.importActual<
    typeof import('~/mocks/data/store/auth')
  >('~/mocks/data/store/auth');

  return {
    useSignInMutation: () => {
      const mutation = (payload: { email: string; password: string }) => ({
        unwrap: async () => {
          const result = authEntity.signIn(payload);

          if (result.status >= 400) {
            throw { data: result.body, status: result.status };
          }

          return result.body;
        },
      });

      return [mutation, { isLoading: mockMutationState.isLoading }] as const;
    },

    useRequestPasswordRecoveryMutation: () => {
      const mutation = (_payload: { email: string }) => ({
        unwrap: async () => {
          if (mockRecoveryConfig.requestShouldFail) {
            throw mockRecoveryConfig.requestError;
          }
          return { message: 'Recovery code sent.' };
        },
      });

      return [mutation, { isLoading: false }] as const;
    },

    useResetPasswordMutation: () => {
      const mutation = (_payload: {
        email: string;
        verificationCode: string;
        newPassword: string;
      }) => ({
        unwrap: async () => {
          if (mockRecoveryConfig.resetShouldFail) {
            throw mockRecoveryConfig.resetError;
          }
          return { message: 'Password reset.' };
        },
      });

      return [mutation, { isLoading: false }] as const;
    },
  };
});

vi.mock('~/store/api/pets/pets-api', () => ({
  useGetMyPetsQuery: () => ({
    refetch: vi.fn(() => ({ unwrap: vi.fn().mockResolvedValue([]) })),
  }),
}));

vi.mock('~/components/google-login-button/google-login-button', () => ({
  GoogleLoginButton: () => <button type="button">Continue with Google</button>,
}));

vi.mock('~/components/facebook-login-button/facebook-login-button', () => ({
  FacebookLoginButton: () => (
    <button type="button">Continue with Facebook</button>
  ),
}));

describe('SignInForm', () => {
  const localStorageMock = (() => {
    let store: { [key: string]: string } = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    mockMutationState.isLoading = false;
    mockRecoveryConfig.requestShouldFail = false;
    mockRecoveryConfig.resetShouldFail = false;
    mockNavigate.mockClear();
    mockNotify.mockClear();
    mockDispatch.mockClear();

    // Clear localStorage mock
    localStorageMock.clear();

    // Replace window.localStorage with our mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });

  it('renders sign-in form with email and password fields', () => {
    renderWithProviders(<SignInForm />);

    expect(
      screen.getByRole('heading', { name: 'Sign In' })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your Email')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your Password')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /create an account/i })
    ).toHaveAttribute('href', ROUTES_PATH.SIGN_UP);
  });

  it('renders disabled submit button when form is invalid', () => {
    renderWithProviders(<SignInForm />);

    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
  });

  it('trims email on blur', () => {
    renderWithProviders(<SignInForm />);

    const emailInput = screen.getByPlaceholderText('Enter your Email');

    fireEvent.change(emailInput, {
      target: { value: '   client@vetcare.dev   ' },
    });
    fireEvent.blur(emailInput);

    expect(emailInput).toHaveValue('client@vetcare.dev');
  });

  it('shows loading submit state when mutation is in progress', () => {
    mockMutationState.isLoading = true;

    renderWithProviders(<SignInForm />);

    const submitButton = screen.getByRole('button', { name: /signing in/i });

    expect(submitButton).toBeDisabled();
  });

  it('prevents default on Enter key from email field', () => {
    renderWithProviders(<SignInForm />);

    const emailInput = screen.getByPlaceholderText('Enter your Email');
    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      bubbles: true,
      cancelable: true,
    });

    const prevented = !emailInput.dispatchEvent(event);
    expect(prevented).toBe(true);
  });

  it('shows validation errors for invalid email and password', async () => {
    renderWithProviders(<SignInForm />);

    const emailInput = screen.getByPlaceholderText('Enter your Email');
    const passwordInput = screen.getByPlaceholderText('Enter your Password');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(
        screen.getByText(
          'Invalid email address. Please ensure it follows the format: username@domain.com'
        )
      ).toBeInTheDocument();
    });
  });

  it('submits with valid credentials and shows success notification', async () => {
    renderWithProviders(<SignInForm />);

    await act(async () => {
      fillSignInForm({
        email: 'client@vetcare.dev',
        password: 'Client123!',
      });
    });

    fireEvent.submit(screen.getByTestId('sign-in-form'));

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        })
      );
    });
  });

  it('shows error notification and sets field errors on invalid credentials', async () => {
    renderWithProviders(<SignInForm />);

    await act(async () => {
      fillSignInForm({
        email: 'wrong@vetcare.dev',
        password: 'WrongPass123!',
      });
    });

    fireEvent.submit(screen.getByTestId('sign-in-form'));

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          description: expect.stringContaining('Incorrect email or password'),
        })
      );
    });
  });

  it('disables submit button during cooldown after failed attempt', async () => {
    renderWithProviders(<SignInForm />);

    await act(async () => {
      fillSignInForm({
        email: 'wrong@vetcare.dev',
        password: 'WrongPass123!',
      });
    });

    fireEvent.submit(screen.getByTestId('sign-in-form'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
    });
  });

  it('displays attempt lockout message after too many failures', async () => {
    renderWithProviders(<SignInForm />);

    window.localStorage.setItem(
      'sign_in_attempts',
      JSON.stringify({ count: 0, blockedUntil: Date.now() + 60_000 })
    );

    await act(async () => {
      fillSignInForm({
        email: 'wrong@vetcare.dev',
        password: 'WrongPassword123!',
      });
    });

    fireEvent.submit(screen.getByTestId('sign-in-form'));

    await waitFor(() => {
      expect(screen.getByTestId('sign-in-locked-alert')).toBeInTheDocument();
    });

    expect(mockNotify).toHaveBeenCalledWith(
      expect.objectContaining({
        description:
          'Too many failed sign in attempts. Please try again later.',
        type: 'error',
      })
    );
    expect(screen.getByTestId('sign-in-locked-alert')).toHaveAttribute(
      'id',
      'sign-in-locked-alert'
    );
    expect(screen.getByTestId('sign-in-locked-alert')).toHaveAttribute(
      'role',
      'alert'
    );
  });

  describe('password recovery', () => {
    const goToRequestStep = () => {
      fireEvent.click(screen.getByRole('button', { name: /forgot password/i }));
    };

    const advanceToResetStep = async (email = 'user@example.com') => {
      goToRequestStep();
      await act(async () => {
        const emailInput = screen.getByPlaceholderText('Enter your Email');
        fireEvent.change(emailInput, { target: { value: email } });
        fireEvent.blur(emailInput);
      });
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /request verification code/i })
        ).toBeEnabled();
      });
      fireEvent.click(
        screen.getByRole('button', { name: /request verification code/i })
      );
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('Enter Verification Code')
        ).toBeInTheDocument();
      });
    };

    describe('request step', () => {
      it('shows request step when clicking Forgot password?', () => {
        renderWithProviders(<SignInForm />);
        goToRequestStep();
        expect(
          screen.getByRole('heading', { name: 'Reset password' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: /request verification code/i })
        ).toBeInTheDocument();
      });

      it('disables Request Verification Code button with empty email', () => {
        renderWithProviders(<SignInForm />);
        goToRequestStep();
        expect(
          screen.getByRole('button', { name: /request verification code/i })
        ).toBeDisabled();
      });

      it('enables Request Verification Code button with valid email', async () => {
        renderWithProviders(<SignInForm />);
        goToRequestStep();
        await act(async () => {
          const emailInput = screen.getByPlaceholderText('Enter your Email');
          fireEvent.change(emailInput, {
            target: { value: 'user@example.com' },
          });
          fireEvent.blur(emailInput);
        });
        await waitFor(() => {
          expect(
            screen.getByRole('button', { name: /request verification code/i })
          ).toBeEnabled();
        });
      });

      it('advances to reset step and shows submitted email', async () => {
        renderWithProviders(<SignInForm />);
        await advanceToResetStep('user@example.com');
        expect(
          screen.getByPlaceholderText('Enter Verification Code')
        ).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText('Enter new password')
        ).toBeInTheDocument();
        expect(screen.getByText(/user@example\.com/)).toBeInTheDocument();
      });

      it('shows error notification when recovery request fails', async () => {
        mockRecoveryConfig.requestShouldFail = true;
        renderWithProviders(<SignInForm />);
        goToRequestStep();
        await act(async () => {
          const emailInput = screen.getByPlaceholderText('Enter your Email');
          fireEvent.change(emailInput, {
            target: { value: 'user@example.com' },
          });
          fireEvent.blur(emailInput);
        });
        await waitFor(() => {
          expect(
            screen.getByRole('button', { name: /request verification code/i })
          ).toBeEnabled();
        });
        fireEvent.click(
          screen.getByRole('button', { name: /request verification code/i })
        );
        await waitFor(() => {
          expect(mockNotify).toHaveBeenCalledWith(
            expect.objectContaining({ type: 'error' })
          );
        });
      });
    });

    describe('reset step', () => {
      it('shows Change email button that returns to request step', async () => {
        renderWithProviders(<SignInForm />);
        await advanceToResetStep();
        fireEvent.click(screen.getByRole('button', { name: /change email/i }));
        expect(
          screen.getByRole('button', { name: /request verification code/i })
        ).toBeInTheDocument();
      });

      it('disables Reset button when verification code is empty', async () => {
        renderWithProviders(<SignInForm />);
        await advanceToResetStep();
        expect(screen.getByRole('button', { name: /^reset$/i })).toBeDisabled();
      });

      it('resets password successfully and navigates to login', async () => {
        renderWithProviders(<SignInForm />);
        await advanceToResetStep('user@example.com');
        await act(async () => {
          fireEvent.change(
            screen.getByPlaceholderText('Enter Verification Code'),
            { target: { value: '123456' } }
          );
          fireEvent.change(screen.getByPlaceholderText('Enter new password'), {
            target: { value: 'NewPass1!' },
          });
          fireEvent.change(
            screen.getByPlaceholderText('Confirm new password'),
            { target: { value: 'NewPass1!' } }
          );
        });
        await waitFor(() => {
          expect(
            screen.getByRole('button', { name: /^reset$/i })
          ).toBeEnabled();
        });
        fireEvent.click(screen.getByRole('button', { name: /^reset$/i }));
        await waitFor(() => {
          expect(mockNotify).toHaveBeenCalledWith(
            expect.objectContaining({
              type: 'success',
              title: 'Success!',
              description: 'Your password has been changed successfully.',
            })
          );
        });
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES_PATH.LOGIN);
      });

      it('shows error notification when reset fails', async () => {
        mockRecoveryConfig.resetShouldFail = true;
        renderWithProviders(<SignInForm />);
        await advanceToResetStep();
        await act(async () => {
          fireEvent.change(
            screen.getByPlaceholderText('Enter Verification Code'),
            { target: { value: '123456' } }
          );
          fireEvent.change(screen.getByPlaceholderText('Enter new password'), {
            target: { value: 'NewPass1!' },
          });
          fireEvent.change(
            screen.getByPlaceholderText('Confirm new password'),
            { target: { value: 'NewPass1!' } }
          );
        });
        await waitFor(() => {
          expect(
            screen.getByRole('button', { name: /^reset$/i })
          ).toBeEnabled();
        });
        fireEvent.click(screen.getByRole('button', { name: /^reset$/i }));
        await waitFor(() => {
          expect(mockNotify).toHaveBeenCalledWith(
            expect.objectContaining({
              type: 'error',
              description: 'Password reset failed.',
            })
          );
        });
      });
    });
  });
});
