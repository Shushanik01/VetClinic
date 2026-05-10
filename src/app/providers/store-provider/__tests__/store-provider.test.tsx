import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StoreProvider } from '~/app/providers/store-provider';

const { mockedStore } = vi.hoisted(() => ({
  mockedStore: { __brand: 'mock-store' },
}));

vi.mock('~/store/store', () => ({
  store: mockedStore,
}));

let providedStore: unknown = null;

vi.mock('react-redux', () => ({
  Provider: ({
    store: incomingStore,
    children,
  }: {
    store: unknown;
    children: ReactNode;
  }) => {
    providedStore = incomingStore;
    return <div data-testid="redux-provider">{children}</div>;
  },
}));

describe('StoreProvider', () => {
  it('wraps children with redux Provider and uses app store', () => {
    render(
      <StoreProvider>
        <div data-testid="child">child</div>
      </StoreProvider>
    );

    expect(screen.getByTestId('redux-provider')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(providedStore).toBe(mockedStore);
  });
});
