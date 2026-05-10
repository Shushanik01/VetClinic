import { describe, expect, it } from 'vitest';
import { render, screen } from '~/__tests__';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthLayout } from '~/layout/auth/auth-layout';

describe('AuthLayout', () => {
  it('renders nested route via Outlet', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<div>Login Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
