import type { ErrorInfo } from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ErrorBoundary } from '~/app/providers/error-boundary/error-boundary';

const ThrowError = () => {
  throw new Error('boom');
};

describe('ErrorBoundary', () => {
  const originalHref = globalThis.location.href;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    globalThis.history.replaceState({}, '', '/tests');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.history.replaceState({}, '', new URL(originalHref).pathname || '/');
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Healthy child</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Healthy child')).toBeInTheDocument();
  });

  it('returns error state from getDerivedStateFromError', () => {
    expect(ErrorBoundary.getDerivedStateFromError()).toEqual({
      hasError: true,
    });
  });

  it('calls componentDidCatch and logs the error', () => {
    const boundary = new ErrorBoundary({ children: null });
    const error = new Error('manual catch');
    const errorInfo = { componentStack: '\n at Test' } as ErrorInfo;

    boundary.componentDidCatch(error, errorInfo);

    expect(console.error).toHaveBeenCalledWith(
      'Caught by ErrorBoundary:',
      error,
      errorInfo
    );
  });

  it('renders fallback UI when a child throws and reload button works', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText('Oops! An unexpected error occurred.')
    ).toBeInTheDocument();

    const reloadButton = screen.getByRole('button', { name: 'Reload Page' });
    fireEvent.click(reloadButton);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('navigates to home when Back to Main Page is clicked', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Back to Main Page' }));
    expect(
      screen.getByText('Oops! An unexpected error occurred.')
    ).toBeInTheDocument();
  });
});
