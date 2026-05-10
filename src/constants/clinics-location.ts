export type ClinicLocationOption = {
  value: string;
  label: string;
};

export const CLINIC_LOCATION_OPTIONS: ClinicLocationOption[] = [
  {
    value: '1a2b3c4d-5678-1234-9abc-def012345678',
    label: '123 Main St, City Clinic',
  },
  {
    value: '9f8e7d6c-5432-4321-9abc-abcdef123456',
    label: '456 Oak Ave, Downtown Vet Center',
  },
  {
    value: 'c9d8e7f6-a5b4-4c3d-2e1f-0a9b8c7d6e5f',
    label: '789 Westside Blvd, Westside Pet Hospital',
  },
];

const normalizeAddress = (value: string): string =>
  value.trim().toLowerCase().replace(/\s+/g, ' ');

const CLINIC_ID_BY_ADDRESS = new Map(
  CLINIC_LOCATION_OPTIONS.map((option) => [
    normalizeAddress(option.label),
    option.value,
  ])
);

export const resolveClinicIdByAddress = (clinicAddress?: string): string => {
  if (!clinicAddress) {
    return '';
  }

  return CLINIC_ID_BY_ADDRESS.get(normalizeAddress(clinicAddress)) ?? '';
};
