import { describe, expect, it } from 'vitest';
import { render, screen } from '~/__tests__';
import { MemoryRouter } from 'react-router-dom';
import { HeaderGuest } from '~/layout/header/ui/header-guest';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

describe('HeaderGuest', () => {
  it('renders guest navigation links and sign in', () => {
    render(
      <MemoryRouter>
        <HeaderGuest />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Main Page' })).toHaveAttribute(
      'href',
      ROUTES_PATH.ROOT
    );
    expect(
      screen.getByRole('link', { name: 'Book Appointment' })
    ).toHaveAttribute('href', ROUTES_PATH.BOOK_APPOINTMENT);
    expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute(
      'href',
      ROUTES_PATH.LOGIN
    );
  });
});
