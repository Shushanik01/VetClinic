import Logo from '~/assets/svg/logo.svg?react';
import { NavLink } from 'react-router-dom';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';
import { UserMenu } from './user-menu';

export const ReceptionistHeader = () => {
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `
		text-lg font-regular transition-colors duration-200
		${
      isActive
        ? 'text-green-400 hover:text-green-600'
        : 'text-black-800 hover:text-black-700'
    }
	`;

  return (
    <header className="w-full mx-auto flex flex-col items-start gap-3 px-4 py-3 rounded-2xl bg-neutral-0 opacity-100 md:h-20 md:flex-row md:items-center md:justify-between md:px-12 md:py-0">
      <div className="h-12 w-auto text-green-400">
        <Logo className="h-full w-auto" />
      </div>

      <nav className="flex flex-wrap items-center gap-3 md:gap-6">
        <NavLink to={ROUTES_PATH.RECEPTIONIST_BOOKING} className={getNavClass}>
          Appointments
        </NavLink>
      </nav>

      <UserMenu />
    </header>
  );
};
