import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { ReactNode } from 'react';
import type { RootState } from '~/store/store';
import { ROUTES_PATH } from './routes-path';
import type { UserRole } from '~/store/features/user/user-types';
import {
  hasAllowedRole,
  isReceptionistRole,
} from '~/store/features/user/user-role';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: readonly UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectTo = ROUTES_PATH.ROOT,
}: ProtectedRouteProps) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const location = useLocation();

  if (!isAuthenticated || !currentUser) {
    return (
      <Navigate
        to={ROUTES_PATH.LOGIN}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (!hasAllowedRole(currentUser.role, allowedRoles)) {
    if (isReceptionistRole(currentUser.role)) {
      return <Navigate to={ROUTES_PATH.RECEPTIONIST_BOOKING} replace />;
    }

    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
