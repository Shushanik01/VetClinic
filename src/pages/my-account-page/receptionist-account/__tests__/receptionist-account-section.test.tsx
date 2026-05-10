import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '~/__tests__';
import { ReceptionistAccountSection } from '~/pages/my-account-page/receptionist-account/receptionist-account-section';

const { mockUserCard } = vi.hoisted(() => ({
  mockUserCard: vi.fn((props: any) => (
    <div data-testid="user-card">{JSON.stringify(props)}</div>
  )),
}));

vi.mock('~/pages/my-account-page/user-account/general-info/user-card', () => ({
  UserCard: mockUserCard,
}));

describe('ReceptionistAccountSection', () => {
  it('passes readonly user info to UserCard', () => {
    renderWithProviders(<ReceptionistAccountSection />, {
      preloadedState: {
        user: {
          isLoggedIn: true,
          currentUser: {
            userId: 'user-1',
            firstName: 'Taylor',
            lastName: 'Green',
            userName: 'Taylor Green',
            email: 'taylor@example.com',
            role: 'Receptionist',
          },
        },
      },
    });

    expect(mockUserCard).toHaveBeenCalledWith(
      expect.objectContaining({
        allowEdit: false,
        showPhotoAction: false,
        extraFields: [
          { label: 'Email', value: 'taylor@example.com' },
          { label: 'Role', value: 'Receptionist' },
        ],
      }),
      undefined
    );
  });
});
