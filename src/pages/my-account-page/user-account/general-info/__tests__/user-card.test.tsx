import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen, fireEvent } from '~/__tests__';
import { UserCard } from '~/pages/my-account-page/user-account/general-info/user-card';

vi.mock('~/store/api/auth/token-utils', () => ({
  extractPhoneNumberFromIdToken: vi.fn().mockReturnValue(undefined),
}));

describe('UserCard', () => {
  const defaultUser = {
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

  it('renders the user display name', () => {
    renderWithProviders(<UserCard />, { preloadedState: defaultUser });
    expect(screen.getByText('Taylor Green')).toBeInTheDocument();
  });

  it('renders First Name field', () => {
    renderWithProviders(<UserCard />, { preloadedState: defaultUser });
    expect(screen.getByText('First Name')).toBeInTheDocument();
    const allTaylor = screen.getAllByText('Taylor');
    expect(allTaylor.length).toBeGreaterThan(0);
  });

  it('renders Last Name field', () => {
    renderWithProviders(<UserCard />, { preloadedState: defaultUser });
    expect(screen.getByText('Last Name')).toBeInTheDocument();
  });

  it('renders Phone Number field', () => {
    renderWithProviders(<UserCard />, { preloadedState: defaultUser });
    expect(screen.getByText('Phone Number')).toBeInTheDocument();
  });

  it('shows "User" when no user data is in the store', () => {
    renderWithProviders(<UserCard />);
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('renders edit button when allowEdit is true (default)', () => {
    renderWithProviders(<UserCard />, { preloadedState: defaultUser });
    expect(
      screen.getByRole('button', { name: /edit user/i })
    ).toBeInTheDocument();
  });

  it('does not render edit button when allowEdit is false', () => {
    renderWithProviders(<UserCard allowEdit={false} />, {
      preloadedState: defaultUser,
    });
    expect(
      screen.queryByRole('button', { name: /edit user/i })
    ).not.toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    renderWithProviders(<UserCard onEdit={onEdit} />, {
      preloadedState: defaultUser,
    });
    fireEvent.click(screen.getByRole('button', { name: /edit user/i }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('renders UserForm when isEditing is true', () => {
    renderWithProviders(
      <UserCard
        isEditing
        formInitialValues={{
          firstName: 'Taylor',
          lastName: 'Green',
          phoneNumber: '+15550000001',
        }}
        onCancelEdit={vi.fn()}
        onSubmitEdit={vi.fn()}
      />,
      { preloadedState: defaultUser }
    );

    expect(screen.getByPlaceholderText('Enter First Name')).toBeInTheDocument();
  });

  it('does not show edit button when isEditing is true', () => {
    renderWithProviders(
      <UserCard isEditing onCancelEdit={vi.fn()} onSubmitEdit={vi.fn()} />,
      { preloadedState: defaultUser }
    );

    expect(
      screen.queryByRole('button', { name: /edit user/i })
    ).not.toBeInTheDocument();
  });

  it('renders extra fields when provided', () => {
    renderWithProviders(
      <UserCard
        extraFields={[{ label: 'Specialization', value: 'Surgery' }]}
      />,
      { preloadedState: defaultUser }
    );
    expect(screen.getByText('Specialization')).toBeInTheDocument();
    expect(screen.getByText('Surgery')).toBeInTheDocument();
  });

  it('renders "-" for empty extra field values', () => {
    renderWithProviders(
      <UserCard extraFields={[{ label: 'Clinic', value: null }]} />,
      { preloadedState: defaultUser }
    );
    expect(screen.getByText('Clinic')).toBeInTheDocument();
  });

  it('renders upload photo button when showPhotoAction is true (default)', () => {
    renderWithProviders(<UserCard />, { preloadedState: defaultUser });
    expect(
      screen.getByRole('button', { name: /upload user photo/i })
    ).toBeInTheDocument();
  });

  it('does not render upload photo button when showPhotoAction is false', () => {
    renderWithProviders(<UserCard showPhotoAction={false} />, {
      preloadedState: defaultUser,
    });
    expect(
      screen.queryByRole('button', { name: /upload user photo/i })
    ).not.toBeInTheDocument();
  });
});
