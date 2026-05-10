import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '~/__tests__';
import { ChangePasswordSection } from '~/pages/my-account-page/user-account/change-password/change-password-section';

const { mockNotify } = vi.hoisted(() => ({
  mockNotify: vi.fn(),
}));

vi.mock('~/app/providers/notifications/notifications', () => ({
  notify: mockNotify,
}));

const mockChangePassword = vi.hoisted(() => vi.fn());

vi.mock('~/store/api/profile/profile-api', () => ({
  useChangePasswordMutation: () => [mockChangePassword, { isLoading: false }],
}));

describe('ChangePasswordSection', () => {
  it('renders all password fields', () => {
    render(<ChangePasswordSection />);

    expect(
      screen.getByPlaceholderText('Enter current password')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter new password')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Confirm new password')
    ).toBeInTheDocument();
  });

  it('renders the Update Password button', () => {
    render(<ChangePasswordSection />);
    expect(
      screen.getByRole('button', { name: /update password/i })
    ).toBeInTheDocument();
  });

  it('submit button is disabled initially (form invalid)', () => {
    render(<ChangePasswordSection />);
    const button = screen.getByRole('button', { name: /update password/i });
    expect(button).toBeDisabled();
  });

  it('shows label for Old Password', () => {
    render(<ChangePasswordSection />);
    expect(screen.getByText('Old Password')).toBeInTheDocument();
  });

  it('shows label for New Password', () => {
    render(<ChangePasswordSection />);
    expect(screen.getByText('New Password')).toBeInTheDocument();
  });

  it('shows label for Confirm Password', () => {
    render(<ChangePasswordSection />);
    expect(screen.getByText('Confirm Password')).toBeInTheDocument();
  });

  it('calls changePassword and notifies success on valid submit', async () => {
    mockChangePassword.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });

    render(<ChangePasswordSection />);

    fireEvent.change(screen.getByPlaceholderText('Enter current password'), {
      target: { value: 'OldPass1!' },
    });
    fireEvent.blur(screen.getByPlaceholderText('Enter current password'));

    fireEvent.change(screen.getByPlaceholderText('Enter new password'), {
      target: { value: 'NewPass1!' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm new password'), {
      target: { value: 'NewPass1!' },
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /update password/i })
      ).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' })
      );
    });
  });

  it('notifies error when changePassword fails', async () => {
    mockChangePassword.mockReturnValue({
      unwrap: vi
        .fn()
        .mockRejectedValue({ status: 500, data: { message: 'Server error' } }),
    });

    render(<ChangePasswordSection />);

    fireEvent.change(screen.getByPlaceholderText('Enter current password'), {
      target: { value: 'OldPass1!' },
    });
    fireEvent.blur(screen.getByPlaceholderText('Enter current password'));

    fireEvent.change(screen.getByPlaceholderText('Enter new password'), {
      target: { value: 'NewPass1!' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm new password'), {
      target: { value: 'NewPass1!' },
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /update password/i })
      ).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' })
      );
    });
  });

  it('notifies wrong password error on 403 response', async () => {
    mockChangePassword.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue({ status: 403 }),
    });

    render(<ChangePasswordSection />);

    fireEvent.change(screen.getByPlaceholderText('Enter current password'), {
      target: { value: 'WrongPass1!' },
    });
    fireEvent.blur(screen.getByPlaceholderText('Enter current password'));

    fireEvent.change(screen.getByPlaceholderText('Enter new password'), {
      target: { value: 'NewPass1!' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm new password'), {
      target: { value: 'NewPass1!' },
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /update password/i })
      ).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          description: 'Incorrect current password.',
        })
      );
    });
  });

  it('toggles old password visibility', () => {
    render(<ChangePasswordSection />);

    const oldPasswordInput = screen.getByPlaceholderText(
      'Enter current password'
    );
    expect(oldPasswordInput).toHaveAttribute('type', 'password');

    // Type something to reveal toggle button
    fireEvent.change(oldPasswordInput, { target: { value: 'Test' } });

    // The toggle button appears inside the relative div wrapping the old password input
    const oldPasswordWrapper = oldPasswordInput.closest(
      '.relative'
    ) as HTMLElement;
    const toggleButton = oldPasswordWrapper.querySelector(
      'button[type="button"]'
    ) as HTMLElement;
    expect(toggleButton).not.toBeNull();
    fireEvent.click(toggleButton);
    expect(oldPasswordInput).toHaveAttribute('type', 'text');
  });
});
