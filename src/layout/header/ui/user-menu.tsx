import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '~/store/store';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';
import { logout } from '~/store/features/auth/auth-slice';
import { getUserDisplayName } from '~/store/features/user/user-name';
import UserIcon from '~/assets/svg/icons/user.svg?react';
import PersonIcon from '~/assets/svg/icons/person.svg?react';
import LogoutIcon from '~/assets/svg/icons/log-out.svg?react';
import { notify } from '~/app/providers/notifications';

export const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate(ROUTES_PATH.ROOT);
    notify({
      description: 'You have been logged out successfully.',
      type: 'success',
    });
  };

  const toggleOpen = () => setOpen((prev) => !prev);

  return (
    <div className="relative">
      <button
        type="button"
        ref={buttonRef}
        onClick={toggleOpen}
        className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-300 cursor-pointer"
        aria-label="User menu"
      >
        <UserIcon />
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-[216px] flex flex-col rounded-2xl bg-neutral-0 border border-green-400 p-4 shadow-[0px_4px_4px_0px_#0446450D] z-50"
        >
          <div className="border-b border-green-100 pb-4 mb-4">
            <p className="text-body-m-bold text-black-900 truncate mb-2">
              {getUserDisplayName(currentUser) || 'User'}
            </p>
            {currentUser?.email && (
              <p className="text-xs text-black-800 truncate mb-1">
                {currentUser.email}
              </p>
            )}
            {currentUser?.role && (
              <p className="text-xs text-black-800 truncate">
                Role: {currentUser.role}
              </p>
            )}
          </div>

          <nav className="flex flex-col gap-3">
            <NavLink
              to={ROUTES_PATH.MY_ACCOUNT}
              className="flex items-center gap-2 text-body-m-regular text-black-800 hover:bg-neutral-50 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <PersonIcon className="h-6 w-6" />
              <span>My Account</span>
            </NavLink>

            <button
              type="button"
              className="flex items-center gap-2 text-body-m-regular text-black-800 hover:bg-neutral-50 text-left cursor-pointer"
              onClick={handleLogout}
            >
              <LogoutIcon className="h-6 w-6" />
              <span>Log Out</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};
