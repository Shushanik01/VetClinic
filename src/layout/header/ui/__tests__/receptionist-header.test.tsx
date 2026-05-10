import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '~/__tests__';
import { MemoryRouter } from 'react-router-dom';
import { ReceptionistHeader } from '~/layout/header/ui/receptionist-header';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

vi.mock('~/layout/header/ui/user-menu', () => ({
  UserMenu: () => <div data-testid="user-menu" />,
}));

describe('ReceptionistHeader', () => {
  it('renders appointments link and user menu', () => {
    render(
      <MemoryRouter>
        <ReceptionistHeader />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Appointments' })).toHaveAttribute(
      'href',
      ROUTES_PATH.RECEPTIONIST_BOOKING
    );
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
  });
});
