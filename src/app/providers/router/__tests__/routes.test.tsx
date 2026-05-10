import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { UserRole } from '~/store/features/user/user-types';

const { createBrowserRouterSpy, mockedState } = vi.hoisted(() => ({
  createBrowserRouterSpy: vi.fn((routes: unknown[]) => ({ routes })),
  mockedState: {
    auth: { isAuthenticated: false },
    user: { currentUser: null as { role?: string } | null },
  },
}));

vi.mock('react-redux', () => ({
  useSelector: (selector: (state: typeof mockedState) => unknown) =>
    selector(mockedState),
}));

vi.mock('react-router-dom', () => ({
  createBrowserRouter: createBrowserRouterSpy,
  Navigate: ({ to }: { to: string }) => (
    <div data-testid="navigate" data-to={to} />
  ),
}));

vi.mock('~/layout/main/main-layout', () => ({
  MainLayout: () => <div data-testid="main-layout" />,
}));

vi.mock('~/layout/auth/auth-layout', () => ({
  AuthLayout: () => <div data-testid="auth-layout" />,
}));

vi.mock('~/pages/main-page/main-page', () => ({
  MainPage: () => <div data-testid="main-page" />,
}));

vi.mock('~/pages/sign-up-page', () => ({
  SignUpPage: () => <div data-testid="sign-up-page" />,
}));

vi.mock('~/pages/book-appointment-page/book-appointment-page', () => ({
  BookAppointmentPage: () => <div data-testid="book-appointment-page" />,
}));

vi.mock('~/pages/not-found-page/not-found-page', () => ({
  NotFoundPage: () => <div data-testid="not-found-page" />,
}));

vi.mock(
  '~/pages/receptionist-booking-appointment/book-Appointent-container/book-appointment',
  () => ({
    default: () => <div data-testid="reception-booking" />,
  })
);

vi.mock('~/pages/veterinarian-details-page/veterinarian-details-page', () => ({
  default: () => <div data-testid="vet-details-page" />,
}));

vi.mock('~/pages/sign-in-page/sign-in-page', () => ({
  SignInPage: () => <div data-testid="sign-in-page" />,
}));

vi.mock('~/pages/my-account-page/my-account-page', () => ({
  MyAccountPage: () => <div data-testid="my-account-page" />,
}));

vi.mock('~/app/providers/router/protected-route', () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('~/pages/Client-Appointments-page/ClientAppoint', () => ({
  ClientAppointments: () => <div data-testid="client-appointments-page" />,
}));

describe('router routes config', () => {
  beforeEach(() => {
    vi.resetModules();
    mockedState.auth.isAuthenticated = false;
    mockedState.user.currentUser = null;
    createBrowserRouterSpy.mockClear();
  });

  it('builds browser router with expected top-level route groups', async () => {
    const routesModule = await import('~/app/providers/router/routes');

    expect(createBrowserRouterSpy).toHaveBeenCalledTimes(1);
    const routeConfig = createBrowserRouterSpy.mock.calls[0][0] as Array<{
      path?: string;
      children?: unknown[];
      element?: React.ReactNode;
    }>;

    expect(routeConfig).toHaveLength(3);
    expect(routeConfig[0].path).toBe('*');
    expect(Array.isArray(routeConfig[1].children)).toBe(true);
    expect(Array.isArray(routeConfig[2].children)).toBe(true);
    expect(routesModule.router).toBeTruthy();
  });

  it('redirects receptionist from wrapped route content to appointments', async () => {
    mockedState.auth.isAuthenticated = true;
    mockedState.user.currentUser = { role: UserRole.RECEPTIONIST };

    await import('~/app/providers/router/routes');

    const routeConfig = createBrowserRouterSpy.mock.calls[0][0] as Array<{
      element?: React.ReactNode;
    }>;

    render(routeConfig[0].element as React.ReactElement);

    expect(screen.getByTestId('navigate')).toHaveAttribute(
      'data-to',
      '/appointments'
    );
  });

  it('renders wrapped route children when user is not receptionist', async () => {
    mockedState.auth.isAuthenticated = true;
    mockedState.user.currentUser = { role: UserRole.CLIENT };

    await import('~/app/providers/router/routes');

    const routeConfig = createBrowserRouterSpy.mock.calls[0][0] as Array<{
      element?: React.ReactNode;
    }>;

    render(routeConfig[0].element as React.ReactElement);

    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });
});
