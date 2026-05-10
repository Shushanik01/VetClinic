import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '~/__tests__';
import { MemoryRouter } from 'react-router-dom';
import { UserHeader } from '~/layout/header/ui/user-header';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

vi.mock('~/layout/header/ui/user-menu', () => ({
  UserMenu: () => <div data-testid="user-menu" />,
}));

describe('UserHeader', () => {
  it('renders authenticated user navigation and menu', () => {
    render(
      <MemoryRouter>
        <UserHeader />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Main Page' })).toHaveAttribute(
      'href',
      ROUTES_PATH.ROOT
    );
    expect(
      screen.getByRole('link', { name: 'Book Appointment' })
    ).toHaveAttribute('href', ROUTES_PATH.BOOK_APPOINTMENT);
    expect(
      screen.getByRole('link', { name: 'My Appointments' })
    ).toHaveAttribute('href', ROUTES_PATH.MY_APPOINTMENTS);
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
  });
});
