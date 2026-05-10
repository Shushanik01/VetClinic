import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DoctorsInfo from '../doctors-info';
import type { VeterinarianProfile } from '~/store/api/vets/vets-types';

vi.mock('~/assets/svg/star.svg', () => ({ default: 'star.svg' }));
vi.mock('~/assets/svg/Icon.svg', () => ({ default: 'icon.svg' }));
vi.mock('~/assets/svg/location.svg', () => ({ default: 'location.svg' }));
vi.mock('~/assets/svg/language.svg', () => ({ default: 'language.svg' }));

const baseVet: VeterinarianProfile = {
  id: '1',
  clinicId: 'clinic-1',
  fullName: 'Dr. Jane Smith',
  specialty: 'General',
  rating: 4.5,
  reviewsCount: 42,
  clinicAddress: '123 Main St',
  specializations: ['Cardiology', 'Surgery'],
  languages: ['English', 'Spanish'],
  education: [],
  certifications: [],
};

describe('DoctorsInfo', () => {
  it('renders rating and review count', () => {
    render(<DoctorsInfo veterinarian={baseVet} />);
    expect(screen.getByText('4.5 (42 reviews)')).toBeInTheDocument();
  });

  it('renders clinic address', () => {
    render(<DoctorsInfo veterinarian={baseVet} />);
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
  });

  it('renders specializations joined from array', () => {
    render(<DoctorsInfo veterinarian={baseVet} />);
    expect(screen.getByText('Cardiology, Surgery')).toBeInTheDocument();
  });

  it('falls back to specialty when specializations array is empty', () => {
    render(<DoctorsInfo veterinarian={{ ...baseVet, specializations: [], specialty: 'Dentistry' }} />);
    expect(screen.getByText('Dentistry')).toBeInTheDocument();
  });

  it('shows "Not specified" when specializations and specialty are both empty', () => {
    render(<DoctorsInfo veterinarian={{ ...baseVet, specializations: [], specialty: '' }} />);
    expect(screen.getAllByText('Not specified').length).toBeGreaterThan(0);
  });

  it('renders languages joined from array', () => {
    render(<DoctorsInfo veterinarian={baseVet} />);
    expect(screen.getByText('English, Spanish')).toBeInTheDocument();
  });

  it('shows "Not specified" when languages array is empty', () => {
    render(<DoctorsInfo veterinarian={{ ...baseVet, languages: [] }} />);
    expect(screen.getAllByText('Not specified').length).toBeGreaterThan(0);
  });

  it('shows "Not specified" for clinic address when empty', () => {
    render(<DoctorsInfo veterinarian={{ ...baseVet, clinicAddress: '' }} />);
    expect(screen.getAllByText('Not specified').length).toBeGreaterThan(0);
  });
});
