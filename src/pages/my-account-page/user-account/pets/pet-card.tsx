import type { FC } from 'react';

import deleteIcon from '~/assets/svg/delete.svg';
import editIcon from '~/assets/svg/edit.svg';
import DogIllustration from '~/assets/svg/DogIllustration.svg';
import CatIllustration from '~/assets/svg/CatIllustration.svg';
import cameraIcon from '~/assets/svg/camera.svg';
import type { PetResponse } from '~/store/api/pets/pets-types';

export type PetCardProps = {
  pet: PetResponse;
  onEdit?: (pet: PetResponse) => void;
  onDelete?: (pet: PetResponse) => void;
};

const getSpeciesFlags = (speciesRaw: string | undefined | null) => {
  const species = (speciesRaw ?? '').toLowerCase();
  const isDog = species === 'dog';
  const isCat = species === 'cat';
  const isOther = !isDog && !isCat;

  return { isDog, isCat, isOther };
};

const formatSpeciesLabel = (pet: PetResponse) => {
  const { isDog, isCat, isOther } = getSpeciesFlags(pet.petSpecies);

  if (isDog) return 'Dog';
  if (isCat) return 'Cat';
  if (isOther) return 'Other';
  return '-';
};

const formatDate = (value?: string | null) => {
  if (!value) return '-';

  try {
    // Handle ISO dates like "2022-05-10" or "2022-05-10T00:00:00Z"
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return value;
  }
};

const formatValue = (value?: string | null) => {
  if (!value) return '-';
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : '-';
};

export const PetCard: FC<PetCardProps> = ({ pet, onEdit, onDelete }) => {
  if (!pet?.id) {
    console.warn('PetCard: Pet object is missing required ID property', pet);
  }

  const { isCat, isOther } = getSpeciesFlags(pet.petSpecies);

  const handleEditClick = () => {
    onEdit?.(pet);
  };

  const handleDeleteClick = () => {
    onDelete?.(pet);
  };

  const fields: { label: string; value: string }[] = [
    { label: 'Name', value: formatValue(pet.petName) },
    { label: 'Species', value: formatSpeciesLabel(pet) },
    { label: 'Breed', value: formatValue(pet.petBreed ?? undefined) },
    { label: 'Date of Birth', value: formatDate(pet.petBirthDate) },
    { label: 'Sex', value: formatValue(pet.petSex ?? undefined) },
  ];

  return (
    <div className="w-full rounded-[32px] border border-green-400 bg-neutral-0 p-4 sm:p-6 flex flex-col gap-3 shadow-sm min-h-fit">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3
          className="text-h3 text-black-900 truncate flex-1"
          title={pet.petName}
        >
          {pet.petName}
        </h3>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            aria-label="Edit pet"
            onClick={handleEditClick}
            className="flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors flex-shrink-0 cursor-pointer p-1.5"
          >
            <img src={editIcon} alt="Edit" />
          </button>
          <button
            type="button"
            aria-label="Delete pet"
            onClick={handleDeleteClick}
            className="flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors flex-shrink-0 cursor-pointer p-1.5"
          >
            <img src={deleteIcon} alt="Delete" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 flex-1 sm:items-start">
        <div className="aspect-square w-24 sm:w-30 rounded-full bg-neutral-400 flex items-center justify-center overflow-visible flex-shrink-0 mx-auto sm:mx-0 relative">
          {isOther ? (
            <span className="text-neutral-0 text-6xl font-bold">?</span>
          ) : isCat ? (
            <img
              src={CatIllustration}
              alt="Cat illustration"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={DogIllustration}
              alt="Dog illustration"
              className="w-full h-full object-cover"
            />
          )}
          <button
            type="button"
            onClick={() => console.log('uploading photo handler')}
            className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-neutral-0 border-2 border-green-400 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Upload pet photo"
          >
            <img src={cameraIcon} alt="Upload pet photo" className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {fields.map((field) => (
            <div key={field.label} className="flex items-center gap-6">
              <span className="text-black-900 text-body-m-bold flex-shrink-0">
                {field.label}
              </span>
              <span className="text-black-900 text-body-m-regular whitespace-nowrap overflow-hidden text-ellipsis">
                {field.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
