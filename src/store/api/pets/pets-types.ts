export type PetBackendResponse = {
  petId: string;
  petName: string;
  petSpecies: string;
  petBreed?: string | null;
  petBirthDate?: string | null;
  petSex?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type PetResponse = {
  id: string;
  petName: string;
  petSpecies: string;
  petBreed?: string | null;
  petBirthDate?: string | null;
  petSex?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type PetListResponse = PetResponse[];

export type CreatePetRequest = {
  petName: string;
  petSpecies: string;
  petBreed?: string | null;
  petBirthDate?: string | null;
  petSex?: string | null;
};

export type UpdatePetRequest = CreatePetRequest;
