import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '~/__tests__';
import { DeletePetPopup } from '~/pages/my-account-page/user-account/pets/delete-pet-popup';
import type { PetResponse } from '~/store/api/pets/pets-types';

const mockPet: PetResponse = {
  id: 'pet-1',
  petName: 'Buddy',
  petSpecies: 'Dog',
};

describe('DeletePetPopup', () => {
  let popupRoot: HTMLDivElement;

  beforeEach(() => {
    popupRoot = document.createElement('div');
    popupRoot.id = 'pop-up';
    document.body.appendChild(popupRoot);
  });

  afterEach(() => {
    document.body.removeChild(popupRoot);
  });

  it('renders nothing when pet is null', () => {
    const { container } = render(
      <DeletePetPopup pet={null} onCancel={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
    expect(screen.queryByText('Delete Pet?')).not.toBeInTheDocument();
  });

  it('renders the confirmation dialog when pet is provided', () => {
    render(
      <DeletePetPopup pet={mockPet} onCancel={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.getByText('Delete Pet?')).toBeInTheDocument();
  });

  it('renders the pet name in the confirmation message', () => {
    render(
      <DeletePetPopup pet={mockPet} onCancel={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.getByText(/Buddy/)).toBeInTheDocument();
  });

  it('renders Cancel and Delete Pet buttons', () => {
    render(
      <DeletePetPopup pet={mockPet} onCancel={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /delete pet/i })
    ).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(
      <DeletePetPopup pet={mockPet} onCancel={onCancel} onConfirm={vi.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Delete Pet button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <DeletePetPopup pet={mockPet} onCancel={vi.fn()} onConfirm={onConfirm} />
    );
    fireEvent.click(screen.getByRole('button', { name: /delete pet/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isDeleting is true', () => {
    render(
      <DeletePetPopup
        pet={mockPet}
        isDeleting
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /delete pet/i })).toBeDisabled();
  });

  it('enables buttons when isDeleting is false', () => {
    render(
      <DeletePetPopup
        pet={mockPet}
        isDeleting={false}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /cancel/i })).not.toBeDisabled();
    expect(
      screen.getByRole('button', { name: /delete pet/i })
    ).not.toBeDisabled();
  });

  it('shows warning about losing medical history', () => {
    render(
      <DeletePetPopup pet={mockPet} onCancel={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.getByText(/medical history/i)).toBeInTheDocument();
  });
});
