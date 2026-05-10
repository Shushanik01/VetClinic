import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen } from '~/__tests__';
import { SignUpPage } from '~/pages/sign-up-page/sign-up-page';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

vi.mock('~/components/captcha/captcha-input', () => ({
  CaptchaInput: () => null,
}));

describe('SignUpPage', () => {
  it('renders sign-up form and marketing content', () => {
    renderWithProviders(<SignUpPage />, { route: ROUTES_PATH.SIGN_UP });

    expect(
      screen.getByRole('heading', { name: 'Create Account' })
    ).toBeInTheDocument();
    expect(screen.getByText('Join the PawCare Family')).toBeInTheDocument();
    expect(screen.getByText('Easy Appointment Booking')).toBeInTheDocument();
    expect(screen.getByText('Medical Records Access')).toBeInTheDocument();
    expect(screen.getByText('Vaccination Reminders')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /continue/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute(
      'href',
      ROUTES_PATH.LOGIN
    );
  });
});
