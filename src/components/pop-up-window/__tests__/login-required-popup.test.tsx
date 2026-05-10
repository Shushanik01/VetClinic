import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginRequiredPopup } from '~/components/pop-up-window/login-required-popup';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

vi.mock('~/components/pop-up-window/popup-window', () => ({
  PopupWindow: ({ children }: any) => (
    <div data-testid="popup-window">{children}</div>
  ),
}));

describe('LoginRequiredPopup', () => {
  it('renders the PawCare heading', () => {
    render(
      <MemoryRouter>
        <LoginRequiredPopup />
      </MemoryRouter>
    );
    expect(screen.getByText('PawCare')).toBeInTheDocument();
  });

  it('renders the login prompt text', () => {
    render(
      <MemoryRouter>
        <LoginRequiredPopup />
      </MemoryRouter>
    );
    expect(
      screen.getByText(/to book an appointment please sign in/i)
    ).toBeInTheDocument();
  });

  it('renders a Sign In link pointing to the login route', () => {
    render(
      <MemoryRouter>
        <LoginRequiredPopup />
      </MemoryRouter>
    );
    const signInLink = screen.getByRole('link', { name: /sign in/i });
    expect(signInLink).toHaveAttribute('href', ROUTES_PATH.LOGIN);
  });

  it('renders a Create Account link pointing to the sign-up route', () => {
    render(
      <MemoryRouter>
        <LoginRequiredPopup />
      </MemoryRouter>
    );
    const createAccountLink = screen.getByRole('link', {
      name: /create account/i,
    });
    expect(createAccountLink).toHaveAttribute('href', ROUTES_PATH.SIGN_UP);
  });

  it('calls onClose when the Sign In link is clicked', () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <LoginRequiredPopup onClose={onClose} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('link', { name: /sign in/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the Create Account link is clicked', () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <LoginRequiredPopup onClose={onClose} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('link', { name: /create account/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders without errors when onClose is not provided', () => {
    expect(() =>
      render(
        <MemoryRouter>
          <LoginRequiredPopup />
        </MemoryRouter>
      )
    ).not.toThrow();
  });
});
