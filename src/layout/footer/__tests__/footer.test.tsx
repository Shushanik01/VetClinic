import { describe, expect, it } from 'vitest';
import { render, screen } from '~/__tests__';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from '~/layout/footer/footer';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

describe('Footer', () => {
  it('renders brand and contact information', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText('PawCare')).toBeInTheDocument();
    expect(screen.getByText('info@pawcare.vet')).toBeInTheDocument();
  });

  it('contains Book Appointment link', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('link', { name: 'Book Appointment' })
    ).toHaveAttribute('href', ROUTES_PATH.BOOK_APPOINTMENT);
  });

  it('shows current year in copyright', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(
      screen.getByText(new RegExp(String(new Date().getFullYear())))
    ).toBeInTheDocument();
  });
});
