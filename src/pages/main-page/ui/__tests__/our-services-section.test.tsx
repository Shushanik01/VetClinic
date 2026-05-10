import { describe, expect, it } from 'vitest';
import { render, screen } from '~/__tests__';
import { OurServicesSection } from '~/pages/main-page/ui/our-services-section';

describe('OurServicesSection', () => {
  it('renders section title and summary', () => {
    render(<OurServicesSection />);

    expect(screen.getByText('Our Services')).toBeInTheDocument();
    expect(
      screen.getByText(
        /From preventive wellness to advanced surgical procedures/i
      )
    ).toBeInTheDocument();
  });

  it('renders all service cards', () => {
    render(<OurServicesSection />);

    expect(screen.getByText('General Practice & Wellness')).toBeInTheDocument();
    expect(screen.getByText('Vaccinations')).toBeInTheDocument();
    expect(screen.getByText('Dental Care')).toBeInTheDocument();
    expect(screen.getByText('Surgical services')).toBeInTheDocument();
    expect(screen.getByText('24/7 Emergency Care')).toBeInTheDocument();
  });
});
