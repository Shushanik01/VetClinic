import { useSelector } from 'react-redux';
import { UserCard } from '~/pages/my-account-page/user-account/general-info/user-card';
import type { RootState } from '~/store/store';

export const ReceptionistAccountSection = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  return (
    <UserCard
      allowEdit={false}
      showPhotoAction={false}
      extraFields={[
        { label: 'Email', value: currentUser?.email },
        { label: 'Role', value: currentUser?.role },
      ]}
    />
  );
};
