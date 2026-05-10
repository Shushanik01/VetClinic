import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '~/__tests__';
import { PetCard } from '~/pages/my-account-page/user-account/pets/pet-card';
import type { PetResponse } from '~/store/api/pets/pets-types';

const mockPet: PetResponse = {
  id: 'pet-1',
  petName: 'Buddy',
  petSpecies: 'Dog',
  petBreed: 'Labrador',
  petBirthDate: '2022-01-10',
  petSex: 'Male',
};

describe('PetCard', () => {
  it('renders the pet name', () => {
    render(<PetCard pet={mockPet} />);
    // "Buddy" appears in the heading title AND in the Name field value
    expect(screen.getAllByText('Buddy').length).toBeGreaterThanOrEqual(1);
  });

  it('renders Name field', () => {
    render(<PetCard pet={mockPet} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders Species field with "Dog"', () => {
    render(<PetCard pet={mockPet} />);
    expect(screen.getByText('Dog')).toBeInTheDocument();
  });

  it('renders Breed field', () => {
    render(<PetCard pet={mockPet} />);
    expect(screen.getByText('Labrador')).toBeInTheDocument();
  });

  it('renders Sex field', () => {
    render(<PetCard pet={mockPet} />);
    expect(screen.getByText('Male')).toBeInTheDocument();
  });

  it('renders Date of Birth field formatted', () => {
    render(<PetCard pet={mockPet} />);
    expect(screen.getByText('Date of Birth')).toBeInTheDocument();
    // Formatted date: "January 10, 2022"
    expect(screen.getByText('January 10, 2022')).toBeInTheDocument();
  });

  it('renders "Cat" for cat species', () => {
    render(<PetCard pet={{ ...mockPet, petSpecies: 'Cat' }} />);
    expect(screen.getByText('Cat')).toBeInTheDocument();
  });

  it('renders "Other" for unknown species', () => {
    render(<PetCard pet={{ ...mockPet, petSpecies: 'Bird' }} />);
    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('renders "-" for missing breed', () => {
    render(<PetCard pet={{ ...mockPet, petBreed: null }} />);
    // There should be at least one "-" for the null field
    expect(screen.getAllByText('-').length).toBeGreaterThan(0);
  });

  it('renders "-" for missing date of birth', () => {
    render(<PetCard pet={{ ...mockPet, petBirthDate: null }} />);
    expect(screen.getAllByText('-').length).toBeGreaterThan(0);
  });

  it('renders edit and delete buttons', () => {
    render(<PetCard pet={mockPet} />);
    expect(
      screen.getByRole('button', { name: /edit pet/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /delete pet/i })
    ).toBeInTheDocument();
  });

  it('calls onEdit with the pet when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<PetCard pet={mockPet} onEdit={onEdit} />);
    fireEvent.click(screen.getByRole('button', { name: /edit pet/i }));
    expect(onEdit).toHaveBeenCalledWith(mockPet);
  });

  it('calls onDelete with the pet when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<PetCard pet={mockPet} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete pet/i }));
    expect(onDelete).toHaveBeenCalledWith(mockPet);
  });
});
