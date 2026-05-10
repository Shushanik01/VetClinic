import { StrictMode } from 'react';
import { RouterProvider } from '~/app/providers/router/index';
import { StoreProvider } from '~/app/providers/store-provider';
import { ErrorBoundary } from '~/app/providers/error-boundary';
import '~/assets/index.css';
import { Notifications } from '~/app/providers/notifications';
import { GoogleOAuthProvider } from '@react-oauth/google';


export const App = () => {
  return (
    <StrictMode>
      <ErrorBoundary>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <StoreProvider>
          <RouterProvider />
          <Notifications />
        </StoreProvider>
        </GoogleOAuthProvider>
      </ErrorBoundary>
    </StrictMode>
  );
};
