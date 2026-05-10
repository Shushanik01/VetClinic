import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen } from '~/__tests__';
import { SignInPage } from '~/pages/sign-in-page/sign-in-page';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

vi.mock('~/components/google-login-button/google-login-button', () => ({
  GoogleLoginButton: () => <button type="button">Continue with Google</button>,
}));

vi.mock('~/components/facebook-login-button/facebook-login-button', () => ({
  FacebookLoginButton: () => (
    <button type="button">Continue with Facebook</button>
  ),
}));

describe('SignInPage', () => {
  it('renders sign-in form and marketing content', () => {
    renderWithProviders(<SignInPage />, { route: ROUTES_PATH.LOGIN });

    expect(
      screen.getByRole('heading', { name: 'Sign In' })
    ).toBeInTheDocument();
    expect(screen.getByText('Welcome Back to PawCare')).toBeInTheDocument();
    expect(
      screen.getByText('Manage Appointments Instantly')
    ).toBeInTheDocument();
    expect(screen.getByText('Access Medical Records')).toBeInTheDocument();
    expect(screen.getByText('Never Miss a Reminder')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /create an account/i })
    ).toHaveAttribute('href', ROUTES_PATH.SIGN_UP);
  });
});
