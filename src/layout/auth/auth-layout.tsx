import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="h-full flex py-3 sm:py-6">
      <Outlet />
    </div>
  );
};
