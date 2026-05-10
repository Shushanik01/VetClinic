import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '~/__tests__';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MainLayout } from '~/layout/main/main-layout';

vi.mock('~/layout/header/header', () => ({
  Header: () => <div data-testid="header" />,
}));

vi.mock('~/layout/footer/footer', () => ({
  Footer: () => <div data-testid="footer" />,
}));

describe('MainLayout', () => {
  it('renders header, outlet content, and footer', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<div>Main Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
