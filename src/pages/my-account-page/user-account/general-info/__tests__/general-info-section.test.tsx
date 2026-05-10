import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen, fireEvent, waitFor } from '~/__tests__';
import { GeneralInfoSection } from '~/pages/my-account-page/user-account/general-info/general-info-section';

const { mockNotify } = vi.hoisted(() => ({
  mockNotify: vi.fn(),
}));

vi.mock('~/app/providers/notifications/notifications', () => ({
  notify: mockNotify,
}));

const mockUpdateProfile = vi.hoisted(() => vi.fn());

vi.mock('~/store/api/profile/profile-api', () => ({
  useUpdateProfileMutation: () => [mockUpdateProfile, { isLoading: false }],
  useChangePasswordMutation: () => [vi.fn(), { isLoading: false }],
}));

vi.mock('~/store/api/auth/token-utils', () => ({
  extractPhoneNumberFromIdToken: vi.fn().mockReturnValue(undefined),
}));

const preloadedUser = {
  user: {
    isLoggedIn: true,
    currentUser: {
      userId: 'user-1',
      firstName: 'Taylor',
      lastName: 'Green',
      userName: 'Taylor Green',
      email: 'taylor@example.com',
      phoneNumber: '+15550000001',
      role: 'Client' as const,
    },
  },
};

describe('GeneralInfoSection', () => {
  it('renders the user card with user info', () => {
    renderWithProviders(<GeneralInfoSection />, {
      preloadedState: preloadedUser,
    });
    expect(screen.getByText('Taylor Green')).toBeInTheDocument();
  });

  it('shows the edit button', () => {
    renderWithProviders(<GeneralInfoSection />, {
      preloadedState: preloadedUser,
    });
    expect(
      screen.getByRole('button', { name: /edit user/i })
    ).toBeInTheDocument();
  });

  it('shows the user form when edit button is clicked', () => {
    renderWithProviders(<GeneralInfoSection />, {
      preloadedState: preloadedUser,
    });

    fireEvent.click(screen.getByRole('button', { name: /edit user/i }));

    expect(screen.getByPlaceholderText('Enter First Name')).toBeInTheDocument();
  });

  it('hides the user form when Cancel is clicked', () => {
    renderWithProviders(<GeneralInfoSection />, {
      preloadedState: preloadedUser,
    });

    fireEvent.click(screen.getByRole('button', { name: /edit user/i }));
    expect(screen.getByPlaceholderText('Enter First Name')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(
      screen.queryByPlaceholderText('Enter First Name')
    ).not.toBeInTheDocument();
  });

  it('calls updateProfile and notifies success on valid submit', async () => {
    mockUpdateProfile.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({
        firstName: 'Taylor',
        lastName: 'Green',
        phoneNumber: '+15550000001',
        email: 'taylor@example.com',
      }),
    });

    renderWithProviders(<GeneralInfoSection />, {
      preloadedState: preloadedUser,
    });

    fireEvent.click(screen.getByRole('button', { name: /edit user/i }));

    // Form is pre-filled with current values; just submit
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /save changes/i })
      ).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' })
      );
    });
  });

  it('notifies error when updateProfile fails', async () => {
    mockUpdateProfile.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue({
        status: 500,
        data: { message: 'Update failed' },
      }),
    });

    renderWithProviders(<GeneralInfoSection />, {
      preloadedState: preloadedUser,
    });

    fireEvent.click(screen.getByRole('button', { name: /edit user/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /save changes/i })
      ).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' })
      );
    });
  });
});
