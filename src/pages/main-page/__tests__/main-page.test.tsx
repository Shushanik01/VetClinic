import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '~/__tests__';
import { MainPage } from '~/pages/main-page/main-page';

vi.mock('~/pages/main-page/ui/appointment-section', () => ({
  AppointmentSection: () => <div data-testid="appointment-section" />,
}));

vi.mock('~/pages/main-page/ui/why-choose-section', () => ({
  WhyChooseSection: () => <div data-testid="why-choose-section" />,
}));

vi.mock('~/pages/main-page/ui/our-services-section', () => ({
  OurServicesSection: () => <div data-testid="our-services-section" />,
}));

vi.mock('~/pages/main-page/ui/our-veterinarians-section', () => ({
  OurVeterinariansSection: () => (
    <div data-testid="our-veterinarians-section" />
  ),
}));

describe('MainPage', () => {
  it('renders all home page sections', () => {
    render(<MainPage />);

    expect(screen.getByTestId('appointment-section')).toBeInTheDocument();
    expect(screen.getByTestId('why-choose-section')).toBeInTheDocument();
    expect(screen.getByTestId('our-services-section')).toBeInTheDocument();
    expect(screen.getByTestId('our-veterinarians-section')).toBeInTheDocument();
  });
});
