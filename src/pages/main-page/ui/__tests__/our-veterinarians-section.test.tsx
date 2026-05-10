import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '~/__tests__';
import { OurVeterinariansSection } from '~/pages/main-page/ui/our-veterinarians-section';

const { mockUseGetVeterinariansListQuery } = vi.hoisted(() => ({
  mockUseGetVeterinariansListQuery: vi.fn(),
}));

vi.mock('~/store/api/vets/vets-api', () => ({
  useGetVeterinariansListQuery: mockUseGetVeterinariansListQuery,
}));

describe('OurVeterinariansSection', () => {
  it('renders loading state', () => {
    mockUseGetVeterinariansListQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<OurVeterinariansSection />);

    expect(screen.getByText('Loading veterinarians...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseGetVeterinariansListQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(<OurVeterinariansSection />);

    expect(
      screen.getByText('Could not load veterinarians right now.')
    ).toBeInTheDocument();
  });

  it('renders empty state when no vets are available', () => {
    mockUseGetVeterinariansListQuery.mockReturnValue({
      data: { veterinarians: [] },
      isLoading: false,
      isError: false,
    });

    render(<OurVeterinariansSection />);

    expect(
      screen.getByText('No veterinarians available at the moment.')
    ).toBeInTheDocument();
  });

  it('renders veterinarian cards and specialization tags', () => {
    mockUseGetVeterinariansListQuery.mockReturnValue({
      data: {
        veterinarians: [
          {
            id: 'vet-1',
            fullName: 'Dr. Alex Stone',
            imageUrl: '/doctor-1.png',
            specializations: ['Surgery', 'Dentistry'],
          },
          {
            id: 'vet-2',
            fullName: 'Dr. Jane Reed',
            imageUrl: '',
            specializations: [],
          },
        ],
      },
      isLoading: false,
      isError: false,
    });

    render(<OurVeterinariansSection />);

    expect(screen.getByText('Dr. Alex Stone')).toBeInTheDocument();
    expect(screen.getByText('Surgery')).toBeInTheDocument();
    expect(screen.getByText('Dentistry')).toBeInTheDocument();
    expect(screen.getByText('Dr. Jane Reed')).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
  });
});
