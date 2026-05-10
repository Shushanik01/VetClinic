import Logo from '~/assets/svg/logo.svg?react';
import { NavLink, useLocation } from 'react-router-dom';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

export const HeaderGuest = () => {
  const location = useLocation();

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
        <NavLink to={ROUTES_PATH.ROOT} end className={getNavClass}>
          Main Page
        </NavLink>

        <NavLink to={ROUTES_PATH.BOOK_APPOINTMENT} className={getNavClass}>
          Book Appointment
        </NavLink>
      </nav>

      <NavLink to={ROUTES_PATH.LOGIN} state={{ from: location.pathname }}>
        <button className="btn-white-m mt-1 md:mt-0">Sign In</button>
      </NavLink>
    </header>
  );
};
