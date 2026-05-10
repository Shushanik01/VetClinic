import type { PetBackendResponse } from '~/store/api/pets/pets-types';

export type StoredPet = PetBackendResponse & {
  ownerUserId: string;
};

export const pets: StoredPet[] = [
  {
    petId: 'pet-1',
    petName: 'Buddy',
    petSpecies: 'Dog',
    petBreed: 'Labrador',
    petBirthDate: '2022-01-10',
    petSex: 'Male',
    createdAt: '2025-01-01T10:00:00.000Z',
    updatedAt: '2025-01-01T10:00:00.000Z',
    ownerUserId: 'client-1',
  },
  {
    petId: 'pet-2',
    petName: 'Luna',
    petSpecies: 'Cat',
    petBreed: 'Siamese',
    petBirthDate: '2021-07-22',
    petSex: 'Female',
    createdAt: '2025-02-10T09:30:00.000Z',
    updatedAt: '2025-02-10T09:30:00.000Z',
    ownerUserId: 'client-1',
  },
  {
    petId: 'pet-3',
    petName: 'Max',
    petSpecies: 'Dog',
    petBreed: 'Beagle',
    petBirthDate: '2023-05-15',
    petSex: 'Male',
    createdAt: '2025-03-05T14:00:00.000Z',
    updatedAt: '2025-03-05T14:00:00.000Z',
    ownerUserId: 'client-2',
  },
];

// Helper functions
export const nowIso = (): string => new Date().toISOString();

export const stripOwner = (pet: StoredPet): PetBackendResponse => {
  const { ownerUserId: _ownerUserId, ...rest } = pet;
  return rest;
};
