import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '~/__tests__';
import { PetList } from '~/pages/my-account-page/user-account/pets/pet-list';
import type { PetResponse } from '~/store/api/pets/pets-types';
import { beforeEach, afterEach } from 'vitest';

const { mockNotify } = vi.hoisted(() => ({
  mockNotify: vi.fn(),
}));

vi.mock('~/app/providers/notifications/notifications', () => ({
  notify: mockNotify,
}));

const mockDeletePet = vi.hoisted(() => vi.fn());
const mockGetMyPetsQuery = vi.hoisted(() => vi.fn());

vi.mock('~/store/api/pets/pets-api', () => ({
  useGetMyPetsQuery: () => mockGetMyPetsQuery(),
  useDeletePetMutation: () => [mockDeletePet, { isLoading: false }],
}));

const mockPets: PetResponse[] = [
  {
    id: 'pet-1',
    petName: 'Buddy',
    petSpecies: 'Dog',
    petBreed: 'Labrador',
    petBirthDate: '2022-01-10',
    petSex: 'Male',
  },
  {
    id: 'pet-2',
    petName: 'Luna',
    petSpecies: 'Cat',
    petBreed: 'Siamese',
    petBirthDate: '2021-07-22',
    petSex: 'Female',
  },
];

describe('PetList', () => {
  let popupRoot: HTMLDivElement;

  beforeEach(() => {
    popupRoot = document.createElement('div');
    popupRoot.id = 'pop-up';
    document.body.appendChild(popupRoot);
  });

  afterEach(() => {
    document.body.removeChild(popupRoot);
  });

  it('shows loading message when isLoading is true', () => {
    mockGetMyPetsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: false,
    });

    render(<PetList />);
    expect(screen.getByText(/loading pets/i)).toBeInTheDocument();
  });

  it('shows loading message when isFetching is true', () => {
    mockGetMyPetsQuery.mockReturnValue({
      data: mockPets,
      isLoading: false,
      isError: false,
      isFetching: true,
    });

    render(<PetList />);
    expect(screen.getByText(/loading pets/i)).toBeInTheDocument();
  });

  it('shows error message when isError is true', () => {
    mockGetMyPetsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
    });

    render(<PetList />);
    expect(
      screen.getByText(/there was a problem loading your pets/i)
    ).toBeInTheDocument();
  });

  it('shows empty state when pets list is empty', () => {
    mockGetMyPetsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      isFetching: false,
    });

    render(<PetList />);
    expect(
      screen.getByText(/you don't have any pets added yet/i)
    ).toBeInTheDocument();
  });

  it('renders pet cards when pets are loaded', () => {
    mockGetMyPetsQuery.mockReturnValue({
      data: mockPets,
      isLoading: false,
      isError: false,
      isFetching: false,
    });

    render(<PetList />);
    expect(screen.getAllByText('Buddy').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Luna').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onEditPet when edit button on a pet card is clicked', () => {
    mockGetMyPetsQuery.mockReturnValue({
      data: mockPets,
      isLoading: false,
      isError: false,
      isFetching: false,
    });

    const onEditPet = vi.fn();
    render(<PetList onEditPet={onEditPet} />);

    const editButtons = screen.getAllByRole('button', { name: /edit pet/i });
    fireEvent.click(editButtons[0]);
    expect(onEditPet).toHaveBeenCalledWith(mockPets[0]);
  });

  it('shows delete confirmation popup when delete button is clicked', () => {
    mockGetMyPetsQuery.mockReturnValue({
      data: mockPets,
      isLoading: false,
      isError: false,
      isFetching: false,
    });

    render(<PetList />);

    const deleteButtons = screen.getAllByRole('button', {
      name: /delete pet/i,
    });
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByText('Delete Pet?')).toBeInTheDocument();
    expect(screen.getAllByText(/Buddy/).length).toBeGreaterThanOrEqual(1);
  });

  it('closes delete popup when Cancel is clicked', () => {
    mockGetMyPetsQuery.mockReturnValue({
      data: mockPets,
      isLoading: false,
      isError: false,
      isFetching: false,
    });

    render(<PetList />);

    const deleteButtons = screen.getAllByRole('button', {
      name: /delete pet/i,
    });
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByText('Delete Pet?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByText('Delete Pet?')).not.toBeInTheDocument();
  });

  it('calls deletePet and notifies success on confirm delete', async () => {
    mockGetMyPetsQuery.mockReturnValue({
      data: mockPets,
      isLoading: false,
      isError: false,
      isFetching: false,
    });

    mockDeletePet.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });

    render(<PetList />);

    const deleteButtons = screen.getAllByRole('button', {
      name: /delete pet/i,
    });
    fireEvent.click(deleteButtons[0]);

    // Use the popup heading to scope button search to the popup dialog
    const popupHeading = screen.getByText('Delete Pet?');
    const popupContainer = popupHeading.closest('div[class]') as HTMLElement;
    const confirmButton = within(popupContainer).getByRole('button', {
      name: /delete pet/i,
    });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' })
      );
    });
  });

  it('notifies error when deletePet fails', async () => {
    mockGetMyPetsQuery.mockReturnValue({
      data: mockPets,
      isLoading: false,
      isError: false,
      isFetching: false,
    });

    mockDeletePet.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue({
        status: 500,
        data: { message: 'Delete failed' },
      }),
    });

    render(<PetList />);

    const deleteButtons = screen.getAllByRole('button', {
      name: /delete pet/i,
    });
    fireEvent.click(deleteButtons[0]);

    const popupHeading = screen.getByText('Delete Pet?');
    const popupContainer = popupHeading.closest('div[class]') as HTMLElement;
    const confirmButton = within(popupContainer).getByRole('button', {
      name: /delete pet/i,
    });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' })
      );
    });
  });
});
