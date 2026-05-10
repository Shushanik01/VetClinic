import { describe, expect, it } from 'vitest';
import { render, screen } from '~/__tests__';
import { MemoryRouter } from 'react-router-dom';
import { AppointmentSection } from '~/pages/main-page/ui/appointment-section';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

describe('AppointmentSection', () => {
  it('renders hero content and CTA', () => {
    render(
      <MemoryRouter>
        <AppointmentSection />
      </MemoryRouter>
    );

    expect(screen.getByText(/Caring for Your/i)).toBeInTheDocument();
    expect(screen.getByText(/Beloved Pets/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Book Appointment' })
    ).toHaveAttribute('href', ROUTES_PATH.BOOK_APPOINTMENT);
  });

  it('renders supporting stats and images', () => {
    render(
      <MemoryRouter>
        <AppointmentSection />
      </MemoryRouter>
    );

    expect(screen.getByText('30+')).toBeInTheDocument();
    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.getByText('10K+')).toBeInTheDocument();
    expect(screen.getByAltText('Appointment 1')).toBeInTheDocument();
    expect(screen.getByAltText('Appointment 2')).toBeInTheDocument();
    expect(screen.getByAltText('Appointment 3')).toBeInTheDocument();
  });
});
