import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PetResponse } from '~/store/api/pets/pets-types';

export const PETS_STORAGE_KEY = 'vetcare_pets';

interface PetsState {
  pets: PetResponse[];
  isLoaded: boolean;
}

const initialState: PetsState = {
  pets: [],
  isLoaded: false,
};

const petsSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    setPets(state, action: PayloadAction<PetResponse[]>) {
      state.pets = action.payload;
      state.isLoaded = true;
    },
    addPet(state, action: PayloadAction<PetResponse>) {
      state.pets.push(action.payload);
    },
    removePet(state, action: PayloadAction<string>) {
      state.pets = state.pets.filter((pet) => pet.id !== action.payload);
    },
    clearPets(state) {
      state.pets = [];
      state.isLoaded = false;
    },
  },
});

export const { setPets, addPet, removePet, clearPets } = petsSlice.actions;
export const petsReducer = petsSlice.reducer;
