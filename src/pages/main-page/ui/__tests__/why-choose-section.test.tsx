import { describe, expect, it } from 'vitest';
import { render, screen } from '~/__tests__';
import { WhyChooseSection } from '~/pages/main-page/ui/why-choose-section';

describe('WhyChooseSection', () => {
  it('renders heading and supporting text', () => {
    render(<WhyChooseSection />);

    expect(screen.getByText('Why Choose PawCare')).toBeInTheDocument();
    expect(
      screen.getByText(/Combining advanced medical technology/i)
    ).toBeInTheDocument();
  });

  it('renders checklist and feature cards', () => {
    render(<WhyChooseSection />);

    expect(
      screen.getByText('Advanced diagnostic imaging (X-ray, Ultrasound)')
    ).toBeInTheDocument();
    expect(screen.getByText('10,000+')).toBeInTheDocument();
    expect(screen.getByText('98%')).toBeInTheDocument();
    expect(screen.getByText('AAHA')).toBeInTheDocument();
    expect(screen.getByText('24/7')).toBeInTheDocument();
  });
});
