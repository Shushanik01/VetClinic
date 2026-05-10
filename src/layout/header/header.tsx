import { useSelector } from 'react-redux';
import type { RootState } from '~/store/store';
import { GuestHeader } from '~/layout/header/ui/guest-header';
import { UserHeader } from '~/layout/header/ui/user-header';
import { ReceptionistHeader } from '~/layout/header/ui/receptionist-header';
import { isReceptionistRole } from '~/store/features/user/user-role';

export const Header = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const currentUserRole = useSelector(
    (state: RootState) => state.user.currentUser?.role
  );

  if (!isAuthenticated || !currentUserRole) {
    return <GuestHeader />;
  }

  return isReceptionistRole(currentUserRole) ? (
    <ReceptionistHeader />
  ) : (
    <UserHeader />
  );
};
