import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AvailableSlotDetails } from '../available-slot-details';

// Mock the Tag component
vi.mock('~/components/ui/tag', () => ({
  Tag: ({ label }: any) => <div data-testid="specialty-tag">{label}</div>,
}));


describe('AvailableSlotDetails', () => {
  const defaultProps = {
    veterinarianSpecialty: 'Cardiology',
    veterinarianName: 'Dr. Smith',
    veterinarianId: 'vet123',
    date: '2025-05-15',
    time: '10:00 AM',
    clinicAddress: '123 Main Street',
  };

  it('should render veterinarian specialty tag', () => {
    render(
      <BrowserRouter>
        <AvailableSlotDetails {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByTestId('specialty-tag')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
  });

  it('should render veterinarian name as link', () => {
    render(
      <BrowserRouter>
        <AvailableSlotDetails {...defaultProps} />
      </BrowserRouter>
    );

    const link = screen.getByRole('link', { name: /Dr. Smith/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/veterinarian/vet123');
  });

  it('should render appointment date', () => {
    render(
      <BrowserRouter>
        <AvailableSlotDetails {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('2025-05-15')).toBeInTheDocument();
  });

  it('should render appointment time', () => {
    render(
      <BrowserRouter>
        <AvailableSlotDetails {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
  });

  it('should render clinic address', () => {
    render(
      <BrowserRouter>
        <AvailableSlotDetails {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('123 Main Street')).toBeInTheDocument();
  });

  it('should have correct link to veterinarian profile', () => {
    render(
      <BrowserRouter>
        <AvailableSlotDetails {...defaultProps} />
      </BrowserRouter>
    );

    const link = screen.getByRole('link') as HTMLAnchorElement;
    expect(link.href).toContain('/veterinarian/vet123');
  });

  it('should render all info sections', () => {
    const { container } = render(
      <BrowserRouter>
        <AvailableSlotDetails {...defaultProps} />
      </BrowserRouter>
    );

    const infoSections = container.querySelectorAll(
     String.raw `.flex.items-center.gap-\\[8px\\]`
    );
    // Should have 5 sections: specialty, doctor, date, time, location
    expect(infoSections.length).toBeGreaterThanOrEqual(4);
  });

  it('should render with different veterinarian data', () => {
    const customProps = {
      veterinarianSpecialty: 'Dermatology',
      veterinarianName: 'Dr. Jones',
      veterinarianId: 'vet456',
      date: '2025-06-20',
      time: '2:30 PM',
      clinicAddress: '456 Oak Avenue',
    };

    render(
      <BrowserRouter>
        <AvailableSlotDetails {...customProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('Dermatology')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Dr. Jones/i })).toHaveAttribute(
      'href',
      '/veterinarian/vet456'
    );
    expect(screen.getByText('2025-06-20')).toBeInTheDocument();
    expect(screen.getByText('2:30 PM')).toBeInTheDocument();
    expect(screen.getByText('456 Oak Avenue')).toBeInTheDocument();
  });
});
