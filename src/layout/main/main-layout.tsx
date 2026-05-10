import { Outlet } from 'react-router-dom';
import { Footer } from '~/layout/footer/footer';
import { Header } from '~/layout/header/header';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col py-3 sm:py-6">
      <Header />

      <main className="flex-1 flex py-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
