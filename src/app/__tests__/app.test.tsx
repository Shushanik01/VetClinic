import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { App } from '~/app/app';

vi.mock('~/app/providers/router/index', () => ({
  RouterProvider: () => <div data-testid="router-provider" />,
}));

vi.mock('~/app/providers/store-provider', () => ({
  StoreProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="store-provider">{children}</div>
  ),
}));

vi.mock('~/app/providers/error-boundary', () => ({
  ErrorBoundary: ({ children }: { children: ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}));

vi.mock('~/app/providers/notifications', () => ({
  Notifications: () => <div data-testid="notifications" />,
}));

describe('App', () => {
  it('renders main providers and app shell components', () => {
    render(<App />);

    const boundary = screen.getByTestId('error-boundary');
    const storeProvider = screen.getByTestId('store-provider');

    expect(boundary).toBeInTheDocument();
    expect(storeProvider).toBeInTheDocument();
    expect(
      within(storeProvider).getByTestId('router-provider')
    ).toBeInTheDocument();
    expect(
      within(storeProvider).getByTestId('notifications')
    ).toBeInTheDocument();
  });
});
