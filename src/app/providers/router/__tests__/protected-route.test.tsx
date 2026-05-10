import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '~/app/providers/router/protected-route';
import { UserRole } from '~/store/features/user/user-types';

const { mockedState, mockedLocation } = vi.hoisted(() => ({
  mockedState: {
    auth: { isAuthenticated: false },
    user: { currentUser: null as { role: string } | null },
  },
  mockedLocation: { pathname: '/private-page' },
}));

vi.mock('react-redux', () => ({
  useSelector: (selector: (state: typeof mockedState) => unknown) =>
    selector(mockedState),
}));

vi.mock('react-router-dom', () => ({
  useLocation: () => mockedLocation,
  Navigate: ({ to, state }: { to: string; state?: { from?: string } }) => (
    <div data-testid="navigate" data-to={to} data-from={state?.from ?? ''} />
  ),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockedState.auth.isAuthenticated = false;
    mockedState.user.currentUser = null;
    mockedLocation.pathname = '/private-page';
  });

  it('redirects unauthenticated user to login and preserves current path', () => {
    render(
      <ProtectedRoute>
        <div>content</div>
      </ProtectedRoute>
    );

    const redirect = screen.getByTestId('navigate');
    expect(redirect).toHaveAttribute('data-to', '/login');
    expect(redirect).toHaveAttribute('data-from', '/private-page');
  });

  it('redirects when current user is missing even if auth flag is true', () => {
    mockedState.auth.isAuthenticated = true;
    mockedState.user.currentUser = null;

    render(
      <ProtectedRoute>
        <div>content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
  });

  it('redirects receptionist to receptionist booking when role is not allowed', () => {
    mockedState.auth.isAuthenticated = true;
    mockedState.user.currentUser = { role: UserRole.RECEPTIONIST };

    render(
      <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
        <div>content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('navigate')).toHaveAttribute(
      'data-to',
      '/appointments'
    );
  });

  it('redirects unauthorized non-receptionist to provided redirect path', () => {
    mockedState.auth.isAuthenticated = true;
    mockedState.user.currentUser = { role: UserRole.CLIENT };

    render(
      <ProtectedRoute
        allowedRoles={[UserRole.RECEPTIONIST]}
        redirectTo="/custom-redirect"
      >
        <div>content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('navigate')).toHaveAttribute(
      'data-to',
      '/custom-redirect'
    );
  });

  it('renders children when user is authenticated and role is allowed', () => {
    mockedState.auth.isAuthenticated = true;
    mockedState.user.currentUser = { role: UserRole.CLIENT };

    render(
      <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
        <div>authorized-content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('authorized-content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });
});
