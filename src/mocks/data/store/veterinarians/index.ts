import type {
  FeedbackPageResponse,
  FeedbackSort,
  VeterinarianProfile,
} from '~/store/api/vets/vets-types';
import type { AvailableSlotsFilters } from './data';
import {
  compareDateStrings,
  deepClone,
  normalizeTime,
} from '~/mocks/data/utils';
import {
  availableSlots,
  feedbackByVeterinarianId,
  veterinarians,
} from './data';

export const veterinariansEntity = {
  getList: (): VeterinarianProfile[] => deepClone(veterinarians),

  getById: (veterinarianId: string) =>
    deepClone(
      veterinarians.find(
        (veterinarian) => veterinarian.id === veterinarianId
      ) ?? null
    ),

  getFeedback: (
    veterinarianId: string,
    page = 0,
    size = 10,
    sort: FeedbackSort = 'date,desc'
  ): FeedbackPageResponse => {
    const feedback = [...(feedbackByVeterinarianId[veterinarianId] ?? [])];
    const [field, direction] = sort.split(',') as [
      'rating' | 'date',
      'asc' | 'desc',
    ];

    feedback.sort((first, second) => {
      const base =
        field === 'rating'
          ? first.rating - second.rating
          : compareDateStrings(first.date, second.date);

      return direction === 'asc' ? base : -base;
    });

    const offset = page * size;
    const content = feedback.slice(offset, offset + size);

    return {
      content: deepClone(content),
      page,
      size,
      totalElements: feedback.length,
      totalPages: Math.max(1, Math.ceil(feedback.length / size)),
    };
  },

  getAvailableSlots: (filters: AvailableSlotsFilters) => {
    const specialty = filters.veterinarianSpecialty?.trim().toLowerCase();
    const date = filters.date?.trim();
    const time = filters.time ? normalizeTime(filters.time) : undefined;
    const clinicId = filters.clinicId?.trim();

    return deepClone(
      availableSlots.filter((slot) => {
        if (
          specialty &&
          slot.veterinarianSpecialty.toLowerCase() !== specialty
        ) {
          return false;
        }

        if (date && slot.date !== date) {
          return false;
        }

        if (time && normalizeTime(slot.time) !== time) {
          return false;
        }

        if (clinicId && slot.clinicId !== clinicId) {
          return false;
        }

        return true;
      })
    );
  },

  getAvailableSlotsByVetAndDate: (veterinarianId: string, date: string) =>
    deepClone(
      availableSlots
        .filter(
          (slot) => slot.veterinarianId === veterinarianId && slot.date === date
        )
        .map((slot) => normalizeTime(slot.time))
    ),

  getAvailableDatesByVet: (veterinarianId: string): string[] =>
    deepClone(
      Array.from(
        new Set(
          availableSlots
            .filter((slot) => slot.veterinarianId === veterinarianId)
            .map((slot) => slot.date)
        )
      ).sort(compareDateStrings)
    ),

  consumeAvailableSlot: (
    veterinarianId: string,
    date: string,
    time: string
  ): void => {
    const normalizedTime = normalizeTime(time);
    const index = availableSlots.findIndex(
      (slot) =>
        slot.veterinarianId === veterinarianId &&
        slot.date === date &&
        normalizeTime(slot.time) === normalizedTime
    );

    if (index >= 0) {
      availableSlots.splice(index, 1);
    }
  },

  hasAvailableSlot: (
    veterinarianId: string,
    date: string,
    time: string
  ): boolean => {
    const normalizedTime = normalizeTime(time);

    return availableSlots.some(
      (slot) =>
        slot.veterinarianId === veterinarianId &&
        slot.date === date &&
        normalizeTime(slot.time) === normalizedTime
    );
  },

  getClinicsByFilters: (
    filters: AvailableSlotsFilters
  ): Array<{
    clinicId: string;
    clinicLocation: string;
  }> => {
    const clinicsMap = new Map<string, string>();

    veterinariansEntity.getAvailableSlots(filters).forEach((slot) => {
      clinicsMap.set(slot.clinicId, slot.clinicAddress);
    });

    return Array.from(clinicsMap.entries()).map(
      ([clinicId, clinicLocation]) => ({
        clinicId,
        clinicLocation,
      })
    );
  },
};
