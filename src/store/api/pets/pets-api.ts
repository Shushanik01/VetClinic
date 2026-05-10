import { baseApi } from '~/store/api/base-api';
import type {
  PetResponse,
  PetBackendResponse,
  PetListResponse,
  CreatePetRequest,
  UpdatePetRequest,
} from '~/store/api/pets/pets-types';

// Transform backend response (petId) to frontend format (id)
const transformPetResponse = (pet: PetBackendResponse): PetResponse => ({
  id: pet.petId,
  petName: pet.petName,
  petSpecies: pet.petSpecies,
  petBreed: pet.petBreed,
  petBirthDate: pet.petBirthDate,
  petSex: pet.petSex,
  createdAt: pet.createdAt,
  updatedAt: pet.updatedAt,
});

export const petsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addPet: builder.mutation<PetResponse, CreatePetRequest>({
      query: (body) => ({
        url: '/pets',
        method: 'POST',
        body,
      }),
      transformResponse: (response: PetBackendResponse) =>
        transformPetResponse(response),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: newPet } = await queryFulfilled;
          dispatch(
            petsApi.util.updateQueryData('getMyPets', undefined, (draft) => {
              draft.push(newPet);
            })
          );
        } catch (error) {
          console.error('addPet Error:', error);
        }
      },
    }),

    getMyPets: builder.query<PetListResponse, void>({
      query: () => ({
        url: '/pets/mine',
        method: 'GET',
      }),
      transformResponse: (response: PetBackendResponse[]) =>
        Array.isArray(response) ? response.map(transformPetResponse) : [],
      providesTags: (result) =>
        result && result.length > 0
          ? [
              ...result.map((pet) => ({
                type: 'Pets' as const,
                id: pet.id,
              })),
              { type: 'Pets' as const, id: 'LIST' },
            ]
          : [{ type: 'Pets' as const, id: 'LIST' }],
      keepUnusedDataFor: 3600,
    }),

    getPetById: builder.query<PetResponse, string>({
      query: (id) => ({
        url: `/pets/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: PetBackendResponse) =>
        transformPetResponse(response),
      providesTags: (_result, _error, id) => [{ type: 'Pets', id }],
    }),

    updatePet: builder.mutation<
      PetResponse,
      { id: string; data: UpdatePetRequest }
    >({
      query: ({ id, data }) => ({
        url: `/pets/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: PetBackendResponse) =>
        transformPetResponse(response),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedPet } = await queryFulfilled;
          dispatch(
            petsApi.util.updateQueryData('getMyPets', undefined, (draft) => {
              const index = draft.findIndex((pet) => pet.id === id);
              if (index !== -1) {
                draft[index] = updatedPet;
              }
            })
          );
        } catch (error) {
          console.error('updatePet Error:', error);
        }
      },
    }),

    deletePet: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/pets/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            petsApi.util.updateQueryData('getMyPets', undefined, (draft) => {
              return draft.filter((pet) => pet.id !== id);
            })
          );
        } catch (error) {
          console.error('deletePet Error:', error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddPetMutation,
  useGetMyPetsQuery,
  useGetPetByIdQuery,
  useUpdatePetMutation,
  useDeletePetMutation,
} = petsApi;
