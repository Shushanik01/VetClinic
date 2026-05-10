import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderWithProviders, screen, fireEvent, waitFor } from '~/__tests__';
import { PetsManagement } from '~/pages/my-account-page/user-account/pets/pets-management';
import type { PetResponse } from '~/store/api/pets/pets-types';

// Provide a working localStorage for the component's useEffect that calls setItem
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  configurable: true,
  writable: true,
});

const { mockNotify } = vi.hoisted(() => ({
  mockNotify: vi.fn(),
}));

vi.mock('~/app/providers/notifications/notifications', () => ({
  notify: mockNotify,
}));

const mockAddPet = vi.hoisted(() => vi.fn());
const mockUpdatePet = vi.hoisted(() => vi.fn());
const mockGetMyPetsQuery = vi.hoisted(() => vi.fn());

vi.mock('~/store/api/pets/pets-api', () => ({
  useGetMyPetsQuery: () => mockGetMyPetsQuery(),
  useAddPetMutation: () => [mockAddPet, { isLoading: false }],
  useUpdatePetMutation: () => [mockUpdatePet, { isLoading: false }],
  useDeletePetMutation: () => [vi.fn(), { isLoading: false }],
}));

// Mock CalendarInput inside the pet form
vi.mock('~/components/forms/date-input/date-input', () => ({
  CalendarInput: ({ label, onChange, value }: any) => (
    <div>
      <label>{label}</label>
      <input
        aria-label={label}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  ),
}));

const mockPets: PetResponse[] = [
  {
    id: 'pet-1',
    petName: 'Buddy',
    petSpecies: 'Dog',
    petBirthDate: '2022-01-10',
  },
];

describe('PetsManagement', () => {
  let popupRoot: HTMLDivElement;

  beforeEach(() => {
    popupRoot = document.createElement('div');
    popupRoot.id = 'pop-up';
    document.body.appendChild(popupRoot);

    mockGetMyPetsQuery.mockReturnValue({
      data: mockPets,
      isLoading: false,
      isError: false,
      isFetching: false,
    });
  });

  afterEach(() => {
    document.body.removeChild(popupRoot);
  });

  it('renders the My Pets heading', () => {
    renderWithProviders(<PetsManagement />);
    expect(screen.getByText('My Pets')).toBeInTheDocument();
  });

  it('renders an Add Pet button', () => {
    renderWithProviders(<PetsManagement />);
    expect(
      screen.getByRole('button', { name: /add pet/i })
    ).toBeInTheDocument();
  });

  it('renders loaded pet cards', () => {
    renderWithProviders(<PetsManagement />);
    expect(screen.getAllByText('Buddy').length).toBeGreaterThanOrEqual(1);
  });

  it('opens the Add Pet form when Add Pet button is clicked', () => {
    renderWithProviders(<PetsManagement />);

    fireEvent.click(screen.getByRole('button', { name: /add pet/i }));

    expect(screen.getByText('Add pet')).toBeInTheDocument();
  });

  it('closes the Add Pet form when Cancel is clicked', () => {
    renderWithProviders(<PetsManagement />);

    fireEvent.click(screen.getByRole('button', { name: /add pet/i }));
    expect(screen.getByText('Add pet')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByText('Add pet')).not.toBeInTheDocument();
  });

  it('opens Edit Pet form when edit button on a pet card is clicked', () => {
    renderWithProviders(<PetsManagement />);

    const editButton = screen.getByRole('button', { name: /edit pet/i });
    fireEvent.click(editButton);

    expect(screen.getByText('Edit pet')).toBeInTheDocument();
  });

  it('calls addPet and notifies success when new pet is submitted', async () => {
    mockAddPet.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({ id: 'pet-new', petName: 'Rex' }),
    });

    renderWithProviders(<PetsManagement />);

    fireEvent.click(screen.getByRole('button', { name: /add pet/i }));

    // Fill required fields
    const nameInputs = screen.getAllByRole('textbox');
    fireEvent.change(nameInputs[0], { target: { value: 'Rex' } });

    const calendarInput = screen.getByRole('textbox', {
      name: /date of birth/i,
    });
    fireEvent.change(calendarInput, { target: { value: '2022-01-01' } });

    const speciesInput = nameInputs.find(
      (el) => (el as HTMLInputElement).placeholder === 'Select species'
    );
    fireEvent.click(speciesInput!);
    // Use button role to avoid matching "Dog" text in existing pet card
    const dogButton = screen
      .getAllByRole('button')
      .find((btn) => btn.textContent?.trim() === 'Dog');
    fireEvent.click(dogButton!);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /submit/i })
      ).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          description: 'Pet has been successfully added.',
        })
      );
    });
  });

  it('calls updatePet and notifies success when editing an existing pet', async () => {
    mockUpdatePet.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });

    renderWithProviders(<PetsManagement />);

    fireEvent.click(screen.getByRole('button', { name: /edit pet/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /submit/i })
      ).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          description: 'Pet has been successfully updated.',
        })
      );
    });
  });

  it('notifies error when addPet fails', async () => {
    mockAddPet.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue({
        status: 500,
        data: { message: 'Failed' },
      }),
    });

    renderWithProviders(<PetsManagement />);

    fireEvent.click(screen.getByRole('button', { name: /add pet/i }));

    const nameInputs = screen.getAllByRole('textbox');
    fireEvent.change(nameInputs[0], { target: { value: 'Rex' } });

    const calendarInput = screen.getByRole('textbox', {
      name: /date of birth/i,
    });
    fireEvent.change(calendarInput, { target: { value: '2022-01-01' } });

    const speciesInput = nameInputs.find(
      (el) => (el as HTMLInputElement).placeholder === 'Select species'
    );
    fireEvent.click(speciesInput!);
    const dogButton = screen
      .getAllByRole('button')
      .find((btn) => btn.textContent?.trim() === 'Dog');
    fireEvent.click(dogButton!);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /submit/i })
      ).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' })
      );
    });
  });
});
