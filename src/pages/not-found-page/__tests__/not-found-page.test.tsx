import { describe, expect, it } from 'vitest';
import { render, screen } from '~/__tests__';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from '~/pages/not-found-page/not-found-page';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

describe('NotFoundPage', () => {
  it('renders 404 content and return link', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Back to Main Page' })
    ).toHaveAttribute('href', ROUTES_PATH.ROOT);
  });
});
