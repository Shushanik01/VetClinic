import { useState, type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Tabs } from '~/components/tabs/tabs';
import { ChangePasswordSection } from '~/pages/my-account-page/user-account/change-password/change-password-section';
import { ChangeEmailSection } from '~/pages/my-account-page/user-account/change-email/change-email-section';
import { GeneralInfoSection } from '~/pages/my-account-page/user-account/general-info/general-info-section';
import { PetsManagement } from '~/pages/my-account-page/user-account/pets/pets-management';
import { ReceptionistAccountSection } from '~/pages/my-account-page/receptionist-account/receptionist-account-section';
import { isReceptionistRole } from '~/store/features/user/user-role';
import type { RootState } from '~/store/store';

type TabValue = 'general' | 'pets' | 'changePassword' | 'changeEmail';

export const MyAccountPage = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('general');
  const currentUserRole = useSelector(
    (state: RootState) => state.user.currentUser?.role
  );
  const isReceptionist = isReceptionistRole(currentUserRole);

  const contentMap: Record<TabValue, ReactNode> = {
    general: <GeneralInfoSection />,
    pets: <PetsManagement />,
    changePassword: <ChangePasswordSection />,
    changeEmail: <ChangeEmailSection />,
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full bg-neutral-0 rounded-3xl p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-black-900">My Account</h1>

        {isReceptionist ? (
          <ReceptionistAccountSection />
        ) : (
          <>
            <Tabs
              options={[
                { label: 'General info', value: 'general' },
                { label: 'My Pets', value: 'pets' },
                { label: 'Change Email', value: 'changeEmail' },
                { label: 'Change Password', value: 'changePassword' },
              ]}
              value={activeTab}
              onChange={(value) => setActiveTab(value as TabValue)}
            />

            {contentMap[activeTab]}
          </>
        )}
      </div>
    </div>
  );
};
