import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PetForm } from '~/pages/my-account-page/user-account/pets/pet-form/pet-form';
import { notify } from '~/app/providers/notifications/notifications';
import type { PetFormValues } from '~/pages/my-account-page/user-account/pets/pet-form/pet-form-fields';
import { PopupWindow } from '~/components/pop-up-window/popup-window';
import { PetList } from '~/pages/my-account-page/user-account/pets/pet-list';
import type { PetResponse } from '~/store/api/pets/pets-types';
import {
  useAddPetMutation,
  useUpdatePetMutation,
  useGetMyPetsQuery,
} from '~/store/api/pets/pets-api';
import { PETS_STORAGE_KEY, setPets } from '~/store/features/pets/pets-slice';

const mapPetToInitialValues = (
  pet: PetResponse | null
): Partial<PetFormValues> => {
  if (!pet) return {};

  const species = (pet.petSpecies ?? '').toLowerCase();
  const sex = (pet.petSex ?? '').toLowerCase();

  const formSpecies =
    species === 'dog'
      ? 'dog'
      : species === 'cat'
        ? 'cat'
        : species === 'other'
          ? 'other'
          : '';

  const formSex =
    sex === 'male'
      ? 'Male'
      : sex === 'female'
        ? 'Female'
        : sex === 'unknown'
          ? 'Unknown'
          : '';

  return {
    id: pet.id,
    name: pet.petName ?? '',
    species: formSpecies,
    breed: pet.petBreed ?? '',
    dateOfBirth: pet.petBirthDate ?? '',
    sex: formSex,
  };
};

export const PetsManagement = () => {
  const dispatch = useDispatch();
  const [isPetFormOpen, setIsPetFormOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<PetResponse | null>(null);
  const [addPet, { isLoading: isAdding }] = useAddPetMutation();
  const [updatePet, { isLoading: isUpdating }] = useUpdatePetMutation();

  // Fetch pets - if recently cached (within 1 hour), won't refetch
  const { data: pets = [] } = useGetMyPetsQuery();

  const isSubmitting = isAdding || isUpdating;

  // Sync fetched pets to Redux store for consistency
  useEffect(() => {
    if (pets.length > 0 || pets.length === 0) {
      dispatch(setPets(pets));

      if (typeof window !== 'undefined') {
        localStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(pets));
      }
    }
  }, [dispatch, pets]);

  const openAddPetForm = () => {
    setEditingPet(null);
    setIsPetFormOpen(true);
  };

  const handleEditPet = (pet: PetResponse) => {
    setEditingPet(pet);
    setIsPetFormOpen(true);
  };

  const handleClosePetForm = () => {
    setIsPetFormOpen(false);
    setEditingPet(null);
  };

  const handleSubmitPetForm = async (values: PetFormValues) => {
    const payload = {
      petName: values.name.trim(),
      petSpecies: values.species.trim().toLowerCase(),
      petBreed:
        values.breed && values.breed.trim().length > 0
          ? values.breed.trim()
          : null,
      petBirthDate: values.dateOfBirth || null,
      petSex:
        values.sex && values.sex.trim().length > 0
          ? values.sex.trim().toLowerCase()
          : null,
    };

    try {
      if (editingPet) {
        await updatePet({ id: editingPet.id, data: payload }).unwrap();
        notify({
          description: 'Pet has been successfully updated.',
          type: 'success',
        });
      } else {
        await addPet(payload).unwrap();
        notify({
          description: 'Pet has been successfully added.',
          type: 'success',
        });
      }

      // RTK Query mutations already update the cache, so this syncs to store
      dispatch(setPets(pets));
      if (typeof window !== 'undefined') {
        localStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(pets));
      }

      handleClosePetForm();
    } catch (error) {
      const errorData = error as any;
      console.error('Failed to save pet:', {
        status: errorData?.status,
        error: errorData?.error,
        data: errorData?.data,
      });
      notify({
        description: errorData?.data?.message || 'Failed to save pet.',
        type: 'error',
      });
    }
  };

  return (
    <>
      <div className="w-full mx-auto px-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-h4 text-black-900">My Pets</h2>
          <button
            type="button"
            className="btn-regular-m w-full sm:w-auto"
            onClick={openAddPetForm}
          >
            Add Pet
          </button>
        </div>

        <PetList onEditPet={handleEditPet} />
      </div>

      {isPetFormOpen && (
        <PopupWindow onClose={handleClosePetForm}>
          <PetForm
            includeOptional
            initialValues={mapPetToInitialValues(editingPet)}
            isSubmitting={isSubmitting}
            mode={editingPet ? 'edit' : 'create'}
            onCancel={handleClosePetForm}
            onSubmit={handleSubmitPetForm}
          />
        </PopupWindow>
      )}
    </>
  );
};
