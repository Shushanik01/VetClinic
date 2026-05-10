import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Qualifications from '../qualifications';
import type { VeterinarianProfile } from '~/store/api/vets/vets-types';

vi.mock('~/assets/svg/Education.svg', () => ({ default: 'education.svg' }));
vi.mock('~/assets/svg/Certifications.svg', () => ({ default: 'certifications.svg' }));

const baseVet: VeterinarianProfile = {
  id: '1',
  clinicId: 'clinic-1',
  fullName: 'Dr. Jane Smith',
  specialty: 'General',
  rating: 4.5,
  reviewsCount: 42,
  clinicAddress: '123 Main St',
  specializations: ['Cardiology'],
  languages: ['English'],
  education: [
    { title: 'DVM', organization: 'State University', year: '2010' },
  ],
  certifications: [
    { title: 'Board Certified', organization: 'Vet Board', year: '2012' },
  ],
};

describe('Qualifications', () => {
  it('renders the "Qualifications" heading', () => {
    render(<Qualifications veterinarian={baseVet} />);
    expect(screen.getByRole('heading', { name: 'Qualifications' })).toBeInTheDocument();
  });

  it('renders the "Education" section heading', () => {
    render(<Qualifications veterinarian={baseVet} />);
    expect(screen.getByRole('heading', { name: /education/i })).toBeInTheDocument();
  });

  it('renders the "Certifications" section heading', () => {
    render(<Qualifications veterinarian={baseVet} />);
    expect(screen.getByRole('heading', { name: /certifications/i })).toBeInTheDocument();
  });

  it('renders education item title, organization, and year', () => {
    render(<Qualifications veterinarian={baseVet} />);
    expect(screen.getByText('DVM')).toBeInTheDocument();
    expect(screen.getByText('State University')).toBeInTheDocument();
    expect(screen.getByText('2010')).toBeInTheDocument();
  });

  it('renders certification item title, organization, and year', () => {
    render(<Qualifications veterinarian={baseVet} />);
    expect(screen.getByText('Board Certified')).toBeInTheDocument();
    expect(screen.getByText('Vet Board')).toBeInTheDocument();
    expect(screen.getByText('2012')).toBeInTheDocument();
  });

  it('renders multiple education items', () => {
    const vet = {
      ...baseVet,
      education: [
        { title: 'DVM', organization: 'State University', year: '2010' },
        { title: 'PhD', organization: 'Tech Institute', year: '2015' },
      ],
    };
    render(<Qualifications veterinarian={vet} />);
    expect(screen.getByText('DVM')).toBeInTheDocument();
    expect(screen.getByText('PhD')).toBeInTheDocument();
    expect(screen.getByText('Tech Institute')).toBeInTheDocument();
  });

  it('renders multiple certification items', () => {
    const vet = {
      ...baseVet,
      certifications: [
        { title: 'Board Certified', organization: 'Vet Board', year: '2012' },
        { title: 'DACVIM', organization: 'ACVIM', year: '2016' },
      ],
    };
    render(<Qualifications veterinarian={vet} />);
    expect(screen.getByText('Board Certified')).toBeInTheDocument();
    expect(screen.getByText('DACVIM')).toBeInTheDocument();
    expect(screen.getByText('ACVIM')).toBeInTheDocument();
  });

  it('shows fallback message when education array is empty', () => {
    render(<Qualifications veterinarian={{ ...baseVet, education: [] }} />);
    expect(screen.getByText('No education information available.')).toBeInTheDocument();
  });

  it('shows fallback message when certifications array is empty', () => {
    render(<Qualifications veterinarian={{ ...baseVet, certifications: [] }} />);
    expect(screen.getByText('No certification information available.')).toBeInTheDocument();
  });

  it('shows both fallback messages when education and certifications are empty', () => {
    render(<Qualifications veterinarian={{ ...baseVet, education: [], certifications: [] }} />);
    expect(screen.getByText('No education information available.')).toBeInTheDocument();
    expect(screen.getByText('No certification information available.')).toBeInTheDocument();
  });

  it('does not show education fallback when education items exist', () => {
    render(<Qualifications veterinarian={baseVet} />);
    expect(screen.queryByText('No education information available.')).not.toBeInTheDocument();
  });

  it('does not show certification fallback when certification items exist', () => {
    render(<Qualifications veterinarian={baseVet} />);
    expect(screen.queryByText('No certification information available.')).not.toBeInTheDocument();
  });

  it('renders education items without showing certification fallback', () => {
    const vet = { ...baseVet, certifications: [] };
    render(<Qualifications veterinarian={vet} />);
    expect(screen.getByText('DVM')).toBeInTheDocument();
    expect(screen.getByText('No certification information available.')).toBeInTheDocument();
  });

  it('renders certification items without showing education fallback', () => {
    const vet = { ...baseVet, education: [] };
    render(<Qualifications veterinarian={vet} />);
    expect(screen.getByText('Board Certified')).toBeInTheDocument();
    expect(screen.getByText('No education information available.')).toBeInTheDocument();
  });
});
