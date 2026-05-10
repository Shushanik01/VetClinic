import { Link } from 'react-router-dom';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

export const NotFoundPage = () => {
  return (
    <div
      className="flex items-center justify-center bg-neutral-50 px-4"
      style={{ height: '90vh' }}
    >
      <div className="bg-neutral-0 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-12 text-center max-w-md w-full">
        <h1 className="text-6xl font-bold text-green-400 mb-4">404</h1>

        <h2 className="text-2xl font-semibold text-black-900 mb-3">
          Page Not Found
        </h2>

        <p className="text-black-600 mb-8 text-center">
          Oops! The page you’re looking for doesn’t exist or may have been
          moved.
        </p>

        <Link
          to={ROUTES_PATH.ROOT}
          className="btn-regular-l inline-flex justify-center"
        >
          Back to Main Page
        </Link>
      </div>
    </div>
  );
};
