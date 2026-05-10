import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '~/__tests__';
import { MemoryRouter } from 'react-router-dom';
import { HeaderLogged } from '~/layout/header/ui/header-logged';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

vi.mock('~/layout/header/ui/user-menu', () => ({
  UserMenu: () => <div data-testid="user-menu" />,
}));

describe('HeaderLogged', () => {
  it('renders logged-in navigation and user menu', () => {
    render(
      <MemoryRouter>
        <HeaderLogged />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Main Page' })).toHaveAttribute(
      'href',
      ROUTES_PATH.ROOT
    );
    expect(
      screen.getByRole('link', { name: 'My Appointments' })
    ).toHaveAttribute('href', ROUTES_PATH.MY_APPOINTMENTS);
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
  });
});
