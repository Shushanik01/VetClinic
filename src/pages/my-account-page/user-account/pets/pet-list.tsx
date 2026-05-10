import type { FC } from 'react';
import { useState } from 'react';

import { PetCard } from '~/pages/my-account-page/user-account/pets/pet-card';
import { notify } from '~/app/providers/notifications/notifications';
import type { PetResponse } from '~/store/api/pets/pets-types';
import {
  useDeletePetMutation,
  useGetMyPetsQuery,
} from '~/store/api/pets/pets-api';
import { DeletePetPopup } from '~/pages/my-account-page/user-account/pets/delete-pet-popup';

export type PetListProps = {
  onEditPet?: (pet: PetResponse) => void;
};

export const PetList: FC<PetListProps> = ({ onEditPet }) => {
  const { data: pets, isLoading, isError, isFetching } = useGetMyPetsQuery();
  const [deletePet, { isLoading: isDeleting }] = useDeletePetMutation();
  const [petToDelete, setPetToDelete] = useState<PetResponse | null>(null);

  const handleRequestDelete = (pet: PetResponse) => {
    setPetToDelete(pet);
  };

  const handleClosePopup = () => {
    setPetToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!petToDelete || !petToDelete.id) return;
    try {
      await deletePet({ id: petToDelete.id }).unwrap();
      setPetToDelete(null);
      notify({
        description: 'Pet has been successfully deleted.',
        type: 'success',
      });
    } catch (error) {
      const errorData = error as any;
      console.error('Failed to delete pet:', {
        status: errorData?.status,
        error: errorData?.error,
        data: errorData?.data,
      });
      notify({
        description: errorData?.data?.message || 'Failed to delete pet.',
        type: 'error',
      });
    }
  };

  if (isLoading || isFetching) {
    return (
      <p className="text-neutral-600 text-body-m-regular">Loading pets...</p>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-body-m-regular">
        There was a problem loading your pets.
      </p>
    );
  }

  if (!pets || pets.length === 0) {
    return (
      <p className="text-neutral-600 text-body-m-regular">
        You don&apos;t have any pets added yet.
      </p>
    );
  }

  return (
    <>
      <div className="w-full grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(420px,1fr))]">
        {pets.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            onEdit={onEditPet}
            onDelete={handleRequestDelete}
          />
        ))}
      </div>

      <DeletePetPopup
        pet={petToDelete}
        isDeleting={isDeleting}
        onCancel={handleClosePopup}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
