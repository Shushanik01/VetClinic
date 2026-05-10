import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen } from '~/__tests__';
import { Header } from '~/layout/header/header';

vi.mock('~/layout/header/ui/guest-header', () => ({
  GuestHeader: () => <div data-testid="guest-header" />,
}));

vi.mock('~/layout/header/ui/user-header', () => ({
  UserHeader: () => <div data-testid="user-header" />,
}));

vi.mock('~/layout/header/ui/receptionist-header', () => ({
  ReceptionistHeader: () => <div data-testid="receptionist-header" />,
}));

describe('Header', () => {
  it('renders GuestHeader when user is not authenticated', () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        auth: { idToken: null, isAuthenticated: false },
      },
    });

    expect(screen.getByTestId('guest-header')).toBeInTheDocument();
  });

  it('renders ReceptionistHeader for authenticated receptionist', () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        auth: { idToken: 'token', isAuthenticated: true },
        user: {
          isLoggedIn: true,
          currentUser: {
            userId: 'user-1',
            userName: 'Reception User',
            email: 'r@example.com',
            role: 'Receptionist',
          },
        },
      },
    });

    expect(screen.getByTestId('receptionist-header')).toBeInTheDocument();
  });

  it('renders UserHeader for authenticated non-receptionist', () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        auth: { idToken: 'token', isAuthenticated: true },
        user: {
          isLoggedIn: true,
          currentUser: {
            userId: 'user-2',
            userName: 'Client User',
            email: 'c@example.com',
            role: 'Client',
          },
        },
      },
    });

    expect(screen.getByTestId('user-header')).toBeInTheDocument();
  });
});
