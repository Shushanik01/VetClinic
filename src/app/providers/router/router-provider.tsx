import { RouterProvider as ReactRouterProvider } from 'react-router-dom';
import { router } from './routes';

export const RouterProvider = () => {
  return <ReactRouterProvider router={router} />;
};
