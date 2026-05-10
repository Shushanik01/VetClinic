import { veterinariansEntity } from '~/mocks/data/store/veterinarians';

type ClinicsFilters = {
  specialty?: string;
  date?: string;
  time?: string;
};

export const clinicsEntity = {
  getByFilters: ({
    specialty,
    date,
    time,
  }: ClinicsFilters): Array<{
    clinicId: string;
    clinicLocation: string;
  }> =>
    veterinariansEntity.getClinicsByFilters({
      veterinarianSpecialty: specialty,
      date,
      time,
    }),
};
