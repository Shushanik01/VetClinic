import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen, fireEvent } from '~/__tests__';
import { UserMenu } from '~/layout/header/ui/user-menu';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  writable: true,
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
});

const { mockNotify, mockNavigate } = vi.hoisted(() => ({
  mockNotify: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock('~/app/providers/notifications', () => ({
  notify: mockNotify,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('UserMenu', () => {
  const preloadedState = {
    user: {
      isLoggedIn: true,
      currentUser: {
        userId: 'user-1',
        userName: 'Taylor Green',
        firstName: 'Taylor',
        lastName: 'Green',
        email: 'taylor@example.com',
        role: 'Client' as const,
      },
    },
    auth: {
      idToken: 'token',
      isAuthenticated: true,
    },
  };

  it('opens and displays user details', () => {
    renderWithProviders(<UserMenu />, { preloadedState });

    fireEvent.click(screen.getByRole('button', { name: 'User menu' }));

    expect(screen.getByText('Taylor Green')).toBeInTheDocument();
    expect(screen.getByText('taylor@example.com')).toBeInTheDocument();
    expect(screen.getByText('Role: Client')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /my account/i })).toHaveAttribute(
      'href',
      ROUTES_PATH.MY_ACCOUNT
    );
  });

  it('closes menu when clicking outside', () => {
    renderWithProviders(<UserMenu />, { preloadedState });

    fireEvent.click(screen.getByRole('button', { name: 'User menu' }));
    expect(
      screen.getByRole('button', { name: /log out/i })
    ).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(
      screen.queryByRole('button', { name: /log out/i })
    ).not.toBeInTheDocument();
  });

  it('logs out, navigates, and shows notification', () => {
    renderWithProviders(<UserMenu />, { preloadedState });

    fireEvent.click(screen.getByRole('button', { name: 'User menu' }));
    fireEvent.click(screen.getByRole('button', { name: /log out/i }));

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES_PATH.ROOT);
    expect(mockNotify).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success' })
    );
  });
});
