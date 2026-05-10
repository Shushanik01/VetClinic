import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookAppointment from '../book-appointment';
import type { VeterinarianProfile } from '~/store/api/vets/vets-types';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../doctors-info', () => ({
  default: () => <div data-testid="doctors-info" />,
}));

vi.mock('../doctors-picture', () => ({
  default: () => <div data-testid="doctors-picture" />,
}));

vi.mock('../booking-time', () => ({
  default: () => <div data-testid="booking-time" />,
}));

const mockVet: VeterinarianProfile = {
  id: 'v1',
  clinicId: 'c1',
  fullName: 'Dr. Jane Smith',
  specialty: 'General',
  rating: 4.8,
  reviewsCount: 10,
  clinicAddress: '123 Vet Lane',
  specializations: ['Surgery'],
  languages: ['English'],
  education: [],
  certifications: [],
};

describe('BookAppointment', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('renders the veterinarian full name as a heading', () => {
    render(<BookAppointment veterinarian={mockVet} veterinarianId="v1" />);
    expect(screen.getByRole('heading', { name: 'Dr. Jane Smith' })).toBeInTheDocument();
  });

  it('renders the back button', () => {
    render(<BookAppointment veterinarian={mockVet} veterinarianId="v1" />);
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('calls navigate(-1) when back button is clicked', () => {
    render(<BookAppointment veterinarian={mockVet} veterinarianId="v1" />);
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('renders DoctorsPicture, DoctorsInfo and BookingTime sub-components', () => {
    render(<BookAppointment veterinarian={mockVet} veterinarianId="v1" />);
    expect(screen.getByTestId('doctors-picture')).toBeInTheDocument();
    expect(screen.getByTestId('doctors-info')).toBeInTheDocument();
    expect(screen.getByTestId('booking-time')).toBeInTheDocument();
  });
});
