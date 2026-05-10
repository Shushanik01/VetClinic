import { baseApi } from '~/store/api/base-api';
import type {
  FeedbackPageResponse,
  VeterinarianAvailableSlotsRequest,
  VeterinarianAvailableSlotsResponse,
  VeterinarianFeedback,
  VeterinarianFeedbackQueryArgs,
  VeterinarianProfile,
  VeterinarianQualificationItem,
  VeterinariansListResponse,
} from './vets-types';

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  return value as Record<string, unknown>;
};

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const asNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const asStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
};

const normalizeQualificationItem = (
  item: unknown
): VeterinarianQualificationItem | null => {
  const record = asRecord(item);

  if (!record) {
    return null;
  }

  const title = asString(record.title || record.name);
  const organization = asString(
    record.organization || record.institution || record.school || record.issuer
  );
  const year = String(record.year ?? record.graduationYear ?? '').trim();

  if (!title && !organization && !year) {
    return null;
  }

  return {
    title: title || 'Not specified',
    organization: organization || 'Not specified',
    year: year || 'Not specified',
  };
};

const normalizeQualifications = (
  value: unknown
): VeterinarianQualificationItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => normalizeQualificationItem(item))
    .filter((item): item is VeterinarianQualificationItem => item !== null);
};

const normalizeVeterinarian = (raw: unknown): VeterinarianProfile => {
  const record = asRecord(raw) ?? {};
  const clinicRecord = asRecord(record.clinic);
  const locationRecord = asRecord(record.location);

  const firstName = asString(record.firstName);
  const lastName = asString(record.lastName);
  const fullName = asString(
    record.fullName || record.veterinarianName || record.name
  ).trim();
  const clinicAddress = asString(
    record.clinicAddress ||
      record.address ||
      record.location ||
      record.locationAddress ||
      clinicRecord?.address ||
      clinicRecord?.clinicAddress ||
      clinicRecord?.location ||
      locationRecord?.address ||
      locationRecord?.clinicAddress ||
      locationRecord?.locationAddress ||
      locationRecord?.name
  );
  const specialty = asString(
    record.specialty || record.veterinarianSpecialty || record.primarySpecialty
  );
  const clinicId = asString(
    record.clinicId ||
      record.clinic_id ||
      record.clinicUuid ||
      record.locationId ||
      record.location_id ||
      record.clinicLocationId ||
      record.clinicUUID ||
      record.locationUUID ||
      clinicRecord?.id ||
      clinicRecord?.clinic_id ||
      clinicRecord?.clinicId ||
      clinicRecord?.clinicUuid ||
      clinicRecord?.locationId ||
      clinicRecord?.uuid ||
      locationRecord?.id ||
      locationRecord?.clinic_id ||
      locationRecord?.clinicId ||
      locationRecord?.clinicUuid ||
      locationRecord?.locationId ||
      locationRecord?.uuid
  );

  return {
    id: asString(record.id || record.veterinarianId),
    clinicId,
    fullName:
      fullName ||
      [firstName, lastName].filter(Boolean).join(' ') ||
      'Veterinarian',
    specialty,
    rating: asNumber(record.rating),
    reviewsCount: asNumber(
      record.reviewsCount || record.feedbackCount || record.votesNumber
    ),
    clinicAddress,
    specializations: asStringArray(
      record.veterinarianSpecializations ||
        record.specializations ||
        record.skills ||
        record.expertise
    ),
    languages: asStringArray(record.veterinarianLanguages || record.languages),
    imageUrl: asString(record.imageUrl || record.photoUrl || record.avatarUrl),
    education: normalizeQualifications(record.education),
    certifications: normalizeQualifications(record.certifications),
  };
};

const normalizeVeterinariansListResponse = (
  raw: unknown
): VeterinariansListResponse => {
  const record = asRecord(raw);
  const listCandidate =
    (record?.veterinarians as unknown) || (record?.items as unknown) || raw;

  if (!Array.isArray(listCandidate)) {
    return { veterinarians: [] };
  }

  return {
    veterinarians: listCandidate.map((item) => normalizeVeterinarian(item)),
  };
};

const normalizeVeterinarianDetailsResponse = (
  raw: unknown
): VeterinarianProfile => {
  const record = asRecord(raw);

  if (record?.veterinarian) {
    const veterinarianRecord = asRecord(record.veterinarian) ?? {};

    return normalizeVeterinarian({
      ...record,
      ...veterinarianRecord,
      clinic: veterinarianRecord.clinic || record.clinic,
      location: veterinarianRecord.location || record.location,
    });
  }

  return normalizeVeterinarian(raw);
};

const normalizeFeedbackItem = (
  raw: unknown,
  index: number
): VeterinarianFeedback => {
  const record = asRecord(raw) ?? {};

  const firstName = asString(record.clientFirstName);
  const lastName = asString(record.clientLastName);
  const fullClientName = asString(record.clientName).trim();
  const petType = asString(record.petType || record.petSpecies);
  const petLabel = asString(record.petLabel);

  return {
    id: asString(record.id || record.feedbackId || `${index}`),
    clientName:
      fullClientName ||
      [firstName, lastName].filter(Boolean).join(' ') ||
      'Anonymous',
    petLabel: petLabel || (petType ? `Pet: ${petType}` : 'Pet: Not specified'),
    rating: asNumber(record.rating),
    comment: asString(record.comment || record.text),
    date: asString(record.date || record.createdAt || record.submittedAt),
  };
};

const normalizeFeedbackResponse = (raw: unknown): FeedbackPageResponse => {
  const record = asRecord(raw) ?? {};
  const contentRaw =
    (record.content as unknown) ||
    (record.items as unknown) ||
    (record.feedback as unknown);
  const contentArray = Array.isArray(contentRaw) ? contentRaw : [];

  const page = asNumber(record.page, 1);
  const size = asNumber(record.size, contentArray.length || 4);
  const totalElements = asNumber(record.totalElements, contentArray.length);
  const totalPages = asNumber(
    record.totalPages,
    Math.max(1, Math.ceil(totalElements / (size || 1)))
  );

  return {
    content: contentArray.map((item, index) =>
      normalizeFeedbackItem(item, index)
    ),
    page,
    size,
    totalElements,
    totalPages,
  };
};

const normalizeAvailableSlotsResponse = (
  raw: unknown
): VeterinarianAvailableSlotsResponse => {
  if (Array.isArray(raw)) {
    return {
      slots: raw.filter((slot): slot is string => typeof slot === 'string'),
    };
  }

  const record = asRecord(raw);

  if (record && Array.isArray(record.slots)) {
    return {
      slots: record.slots.filter(
        (slot): slot is string => typeof slot === 'string'
      ),
    };
  }

  return { slots: [] };
};

export const vetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVeterinariansList: builder.query<VeterinariansListResponse, void>({
      query: () => ({
        url: '/veterinarians',
        method: 'GET',
      }),
      transformResponse: normalizeVeterinariansListResponse,
      keepUnusedDataFor: 7200,
      providesTags: ['Veterinarians'],
    }),

    getVeterinarianById: builder.query<VeterinarianProfile, string>({
      query: (veterinarianId) => ({
        url: `/veterinarians/${veterinarianId}`,
        method: 'GET',
      }),
      transformResponse: normalizeVeterinarianDetailsResponse,
      keepUnusedDataFor: 300,
      providesTags: (_result, _error, veterinarianId) => [
        { type: 'Veterinarian', id: veterinarianId },
      ],
    }),

    getVeterinarianFeedback: builder.query<
      FeedbackPageResponse,
      VeterinarianFeedbackQueryArgs
    >({
      query: ({ veterinarianId, page, size, sort }) => ({
        url: `/veterinarians/${veterinarianId}/feedback`,
        method: 'GET',
        params: {
          page,
          size,
          sort,
        },
      }),
      transformResponse: normalizeFeedbackResponse,
      keepUnusedDataFor: 180,
      providesTags: (_result, _error, args) => [
        { type: 'VeterinarianFeedback', id: args.veterinarianId },
      ],
    }),

    getVeterinarianAvailableSlots: builder.query<
      VeterinarianAvailableSlotsResponse,
      VeterinarianAvailableSlotsRequest
    >({
      query: ({ veterinarianId, date }) => ({
        url: `/veterinarians/${veterinarianId}/available-slots/${date}`,
        method: 'GET',
      }),
      transformResponse: normalizeAvailableSlotsResponse,
      keepUnusedDataFor: 60,
      providesTags: (_result, _error, args) => [
        {
          type: 'VeterinarianAvailableSlots',
          id: `${args.veterinarianId}-${args.date}`,
        },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVeterinariansListQuery,
  useGetVeterinarianByIdQuery,
  useGetVeterinarianFeedbackQuery,
  useGetVeterinarianAvailableSlotsQuery,
} = vetsApi;
