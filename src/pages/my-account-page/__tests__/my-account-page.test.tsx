import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen, fireEvent } from '~/__tests__';
import { MyAccountPage } from '~/pages/my-account-page/my-account-page';

vi.mock(
  '~/pages/my-account-page/user-account/change-password/change-password-section',
  () => ({
    ChangePasswordSection: () => <div>Change Password Section</div>,
  })
);

vi.mock(
  '~/pages/my-account-page/user-account/general-info/general-info-section',
  () => ({
    GeneralInfoSection: () => <div>General Info Section</div>,
  })
);

vi.mock('~/pages/my-account-page/user-account/pets/pets-management', () => ({
  PetsManagement: () => <div>Pets Management Section</div>,
}));

vi.mock(
  '~/pages/my-account-page/receptionist-account/receptionist-account-section',
  () => ({
    ReceptionistAccountSection: () => <div>Receptionist Account Section</div>,
  })
);

describe('MyAccountPage', () => {
  const clientState = {
    user: {
      isLoggedIn: true,
      currentUser: {
        userId: 'client-1',
        userName: 'Client User',
        email: 'client@example.com',
        role: 'Client' as const,
      },
    },
  };

  const receptionistState = {
    user: {
      isLoggedIn: true,
      currentUser: {
        userId: 'receptionist-1',
        userName: 'Reception User',
        email: 'reception@example.com',
        role: 'Receptionist' as const,
      },
    },
  };

  it('renders tabs and default general section for client', () => {
    renderWithProviders(<MyAccountPage />, { preloadedState: clientState });

    expect(
      screen.getByRole('button', { name: 'General info' })
    ).toBeInTheDocument();
    expect(screen.getByText('General Info Section')).toBeInTheDocument();
  });

  it('switches tab content when tab is clicked', () => {
    renderWithProviders(<MyAccountPage />, { preloadedState: clientState });

    fireEvent.click(screen.getByRole('button', { name: 'My Pets' }));
    expect(screen.getByText('Pets Management Section')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Change Password' }));
    expect(screen.getByText('Change Password Section')).toBeInTheDocument();
  });

  it('renders receptionist account section for receptionist role', () => {
    renderWithProviders(<MyAccountPage />, {
      preloadedState: receptionistState,
    });

    expect(
      screen.getByText('Receptionist Account Section')
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'General info' })
    ).not.toBeInTheDocument();
  });
});
