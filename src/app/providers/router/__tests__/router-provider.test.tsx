import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider } from '~/app/providers/router/router-provider';

const { mockedRouter, receivedRouter } = vi.hoisted(() => ({
  mockedRouter: { id: 'mock-router' },
  receivedRouter: { current: null as unknown },
}));

vi.mock('react-router-dom', () => ({
  RouterProvider: ({ router }: { router: unknown }) => {
    receivedRouter.current = router;
    return <div data-testid="react-router-provider" />;
  },
}));

vi.mock('~/app/providers/router/routes', () => ({
  router: mockedRouter,
}));

describe('RouterProvider', () => {
  it('passes configured router to react-router provider', () => {
    render(<RouterProvider />);

    expect(screen.getByTestId('react-router-provider')).toBeInTheDocument();
    expect(receivedRouter.current).toBe(mockedRouter);
  });
});
