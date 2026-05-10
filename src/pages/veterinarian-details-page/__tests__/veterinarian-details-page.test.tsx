import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import VeterinarianDetailsPage from '../veterinarian-details-page';
import type { VeterinarianProfile } from '~/store/api/vets/vets-types';

// --- hoisted mocks ---
const { mockParams, mockQueryResult } = vi.hoisted(() => ({
  mockParams: { veterinarianId: 'v1' as string | undefined },
  mockQueryResult: {
    data: undefined as VeterinarianProfile | undefined,
    isLoading: false,
    isError: false,
  },
}));

vi.mock('react-router-dom', () => ({
  useParams: () => mockParams,
}));

vi.mock('~/store/api/vets/vets-api', () => ({
  useGetVeterinarianByIdQuery: () => mockQueryResult,
}));

vi.mock('../booking-card/book-appointment', () => ({
  default: () => <div data-testid="book-appointments" />,
}));

vi.mock('../qualifications/qualifications', () => ({
  default: () => <div data-testid="qualifications" />,
}));

vi.mock('../client-feedback/client-feedback', () => ({
  default: () => <div data-testid="client-feedback" />,
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

describe('VeterinarianDetailsPage', () => {
  beforeEach(() => {
    mockParams.veterinarianId = 'v1';
    mockQueryResult.data = undefined;
    mockQueryResult.isLoading = false;
    mockQueryResult.isError = false;
  });

  it('shows invalid URL message when veterinarianId is missing', () => {
    mockParams.veterinarianId = undefined;
    render(<VeterinarianDetailsPage />);
    expect(
      screen.getByText('Invalid veterinarian profile URL.')
    ).toBeInTheDocument();
  });

  it('shows loading message when isLoading is true', () => {
    mockQueryResult.isLoading = true;
    render(<VeterinarianDetailsPage />);
    expect(
      screen.getByText('Loading veterinarian profile...')
    ).toBeInTheDocument();
  });

  it('shows error message when isError is true', () => {
    mockQueryResult.isError = true;
    render(<VeterinarianDetailsPage />);
    expect(
      screen.getByText('Failed to load veterinarian profile. Please try again later.')
    ).toBeInTheDocument();
  });

  it('shows error message when veterinarian data is undefined after loading', () => {
    mockQueryResult.data = undefined;
    render(<VeterinarianDetailsPage />);
    expect(
      screen.getByText('Failed to load veterinarian profile. Please try again later.')
    ).toBeInTheDocument();
  });

  it('renders BookAppointments, Qualifications, and ClientFeedback when data is loaded', () => {
    mockQueryResult.data = mockVet;
    render(<VeterinarianDetailsPage />);
    expect(screen.getByTestId('book-appointments')).toBeInTheDocument();
    expect(screen.getByTestId('qualifications')).toBeInTheDocument();
    expect(screen.getByTestId('client-feedback')).toBeInTheDocument();
  });

  it('does not render sub-components while loading', () => {
    mockQueryResult.isLoading = true;
    render(<VeterinarianDetailsPage />);
    expect(screen.queryByTestId('book-appointments')).not.toBeInTheDocument();
    expect(screen.queryByTestId('qualifications')).not.toBeInTheDocument();
    expect(screen.queryByTestId('client-feedback')).not.toBeInTheDocument();
  });

  it('does not render sub-components when there is an error', () => {
    mockQueryResult.isError = true;
    render(<VeterinarianDetailsPage />);
    expect(screen.queryByTestId('book-appointments')).not.toBeInTheDocument();
    expect(screen.queryByTestId('qualifications')).not.toBeInTheDocument();
    expect(screen.queryByTestId('client-feedback')).not.toBeInTheDocument();
  });

  it('does not render sub-components when veterinarianId is missing', () => {
    mockParams.veterinarianId = undefined;
    render(<VeterinarianDetailsPage />);
    expect(screen.queryByTestId('book-appointments')).not.toBeInTheDocument();
    expect(screen.queryByTestId('qualifications')).not.toBeInTheDocument();
    expect(screen.queryByTestId('client-feedback')).not.toBeInTheDocument();
  });
});
