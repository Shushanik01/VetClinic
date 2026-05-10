import type {
  CreatePetRequest,
  PetBackendResponse,
  UpdatePetRequest,
} from '~/store/api/pets/pets-types';
import { deepClone } from '~/mocks/data/utils';
import { pets, stripOwner, nowIso } from './data';

export const petsEntity = {
  listByUserId: (userId: string): PetBackendResponse[] =>
    deepClone(pets.filter((pet) => pet.ownerUserId === userId).map(stripOwner)),

  getById: (userId: string, petId: string): PetBackendResponse | null => {
    const pet = pets.find(
      (item) => item.ownerUserId === userId && item.petId === petId
    );

    return pet ? deepClone(stripOwner(pet)) : null;
  },

  listByOwnerIds: (
    ownerUserIds: string[]
  ): Array<PetBackendResponse & { ownerUserId: string }> =>
    deepClone(
      pets
        .filter((pet) => ownerUserIds.includes(pet.ownerUserId))
        .map((pet) => ({ ...stripOwner(pet), ownerUserId: pet.ownerUserId }))
    ),

  create: (userId: string, payload: CreatePetRequest): PetBackendResponse => {
    const timestamp = nowIso();

    const createdPet = {
      petId: `pet-${crypto.randomUUID().slice(0, 8)}`,
      petName: payload.petName,
      petSpecies: payload.petSpecies,
      petBreed: payload.petBreed ?? null,
      petBirthDate: payload.petBirthDate ?? null,
      petSex: payload.petSex ?? null,
      createdAt: timestamp,
      updatedAt: timestamp,
      ownerUserId: userId,
    };

    pets.unshift(createdPet);
    return deepClone(stripOwner(createdPet));
  },

  update: (
    userId: string,
    petId: string,
    payload: UpdatePetRequest
  ): PetBackendResponse | null => {
    const pet = pets.find(
      (item) => item.ownerUserId === userId && item.petId === petId
    );

    if (!pet) {
      return null;
    }

    pet.petName = payload.petName;
    pet.petSpecies = payload.petSpecies;
    pet.petBreed = payload.petBreed ?? null;
    pet.petBirthDate = payload.petBirthDate ?? null;
    pet.petSex = payload.petSex ?? null;
    pet.updatedAt = nowIso();

    return deepClone(stripOwner(pet));
  },

  remove: (userId: string, petId: string): boolean => {
    const index = pets.findIndex(
      (item) => item.ownerUserId === userId && item.petId === petId
    );

    if (index < 0) {
      return false;
    }

    pets.splice(index, 1);
    return true;
  },
};
