import { Navigate, createBrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MainLayout } from '~/layout/main/main-layout';
import { AuthLayout } from '~/layout/auth/auth-layout';
import { MainPage } from '~/pages/main-page/main-page';
import { SignUpPage } from '~/pages/sign-up-page';
import { BookAppointmentPage } from '~/pages/book-appointment-page/book-appointment-page';
import { NotFoundPage } from '~/pages/not-found-page/not-found-page';
import { ROUTES_PATH } from './routes-path';

import ReceptionBooking from '~/pages/receptionist-booking-appointment/book-Appointent-container/book-appointment';

import VeterinarianDetailsPage from '~/pages/veterinarian-details-page/veterinarian-details-page';

import { SignInPage } from '~/pages/sign-in-page/sign-in-page';
import { MyAccountPage } from '~/pages/my-account-page/my-account-page';
import { ProtectedRoute } from './protected-route';
import { ClientAppointments } from '~/pages/Client-Appointments-page/ClientAppoint';
import { UserRole } from '~/store/features/user/user-types';
import type { RootState } from '~/store/store';
import { isReceptionistRole } from '~/store/features/user/user-role';

const RedirectReceptionistToAppointments = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  if (isAuthenticated && isReceptionistRole(currentUser?.role)) {
    return <Navigate to={ROUTES_PATH.RECEPTIONIST_BOOKING} replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: ROUTES_PATH.NOT_FOUND,
    element: (
      <RedirectReceptionistToAppointments>
        <NotFoundPage />
      </RedirectReceptionistToAppointments>
    ),
  },

  {
    element: <MainLayout />,
    children: [
      {
        path: ROUTES_PATH.ROOT,
        element: (
          <RedirectReceptionistToAppointments>
            <MainPage />
          </RedirectReceptionistToAppointments>
        ),
      },
      {
        path: ROUTES_PATH.VETERINARIAN_PROFILE,
        element: (
          <RedirectReceptionistToAppointments>
            <VeterinarianDetailsPage />
          </RedirectReceptionistToAppointments>
        ),
      },

      {
        path: ROUTES_PATH.RECEPTIONIST_BOOKING,
        element: (
          <ProtectedRoute allowedRoles={[UserRole.RECEPTIONIST]}>
            <ReceptionBooking />
          </ProtectedRoute>
        ),
      },

      {
        path: ROUTES_PATH.MY_APPOINTMENTS,
        element: (
          <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
            <ClientAppointments />
          </ProtectedRoute>
        ),
      },

      {
        path: ROUTES_PATH.BOOK_APPOINTMENT,
        element: (
          <RedirectReceptionistToAppointments>
            <BookAppointmentPage />
          </RedirectReceptionistToAppointments>
        ),
      },
      {
        path: ROUTES_PATH.MY_ACCOUNT,
        element: (
          <ProtectedRoute>
            <MyAccountPage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES_PATH.LOGIN,
        element: (
          <RedirectReceptionistToAppointments>
            <SignInPage />
          </RedirectReceptionistToAppointments>
        ),
      },
      {
        path: ROUTES_PATH.SIGN_UP,
        element: (
          <RedirectReceptionistToAppointments>
            <SignUpPage />
          </RedirectReceptionistToAppointments>
        ),
      },
    ],
  },
]);
