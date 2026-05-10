import { Link } from 'react-router-dom';

import LogoIcon from '~/assets/svg/logo.svg?react';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';
import { PopupWindow } from './popup-window';

type LoginRequiredPopupProps = {
  onClose?: () => void;
};

export const LoginRequiredPopup = ({ onClose }: LoginRequiredPopupProps) => {
  return (
    <PopupWindow onClose={onClose}>
      <div className="bg-neutral-0 rounded-[16px] p-[48px] flex flex-col gap-[24px] max-w-[544px] w-[90vw]">
        <div className="flex flex-col gap-[8px]">
          <LogoIcon className="w-[120px] h-auto" />
          <h2 className="text-h2 text-black-900">PawCare</h2>
          <p className="text-body-m-regular text-neutral-600">
            Veterinary Excellence
          </p>
        </div>

        <p className="text-body-m-regular text-black-900">
          To book an appointment please sign in or create an account.
        </p>

        <div className="mt-auto flex flex-col gap-[16px]">
          <Link
            to={ROUTES_PATH.LOGIN}
            className="btn-regular-l flex-1 text-center"
            onClick={onClose}
          >
            Sign In
          </Link>
          <Link
            to={ROUTES_PATH.SIGN_UP}
            className="btn-white-l flex-1 text-center"
            onClick={onClose}
          >
            Create Account
          </Link>
        </div>
      </div>
    </PopupWindow>
  );
};
