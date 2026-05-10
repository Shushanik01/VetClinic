import { baseApi } from '~/store/api/base-api';

export type ClientWithPets = {
  userId: string;
  firstName: string;
  lastName: string;
  pets: Array<{ petId: string; name: string }>;
};

export const clientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<ClientWithPets[], void>({
      query: () => ({ url: '/clients', method: 'GET' }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetClientsQuery } = clientsApi;
