import { authEntity } from '~/mocks/data/store/auth';
import { petsEntity } from '~/mocks/data/store/pets';

export const clientsEntity = {
  getAllWithPets: (): Array<{
    clientId: string;
    firstName: string;
    lastName: string;
    pets: Array<{ petId: string; petName: string }>;
  }> => {
    const clients = authEntity.listUsersByRole('Client');
    const pets = petsEntity.listByOwnerIds(
      clients.map((client) => client.userId)
    );

    return clients.map((client) => ({
      clientId: client.userId,
      firstName: client.firstName,
      lastName: client.lastName,
      pets: pets
        .filter((pet) => pet.ownerUserId === client.userId)
        .map((pet) => ({ petId: pet.petId, petName: pet.petName })),
    }));
  },
};
