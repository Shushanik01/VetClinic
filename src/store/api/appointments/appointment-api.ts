import { baseApi } from '~/store/api/base-api';
import { vetsApi } from '~/store/api/vets/vets-api';
import type { VeterinarianAvailableSlotsRequest } from '~/store/api/vets/vets-types';
import type {
  AvailableSlotsRequest,
  AvailableSlotsResponse,
  BookAppointmentRequest,
  BookAppointmentResponse,
  AppointmentsListResponse,
  AppointmentCancelResponse,
  AppointmentRescheduleResponse,
} from './appointment-types';

const TIME_PREFIX_REGEXP = /^(\d{2}:\d{2})/;

const normalizeTime = (value: string): string => {
  const parsed = TIME_PREFIX_REGEXP.exec(value);
  return parsed ? parsed[1] : value;
};

type BookedSlotContext = {
  veterinarianId: string;
  bookedDate: string;
  normalizedBookedTime: string;
};

const shouldRemoveBookedSlot = (
  slot: { veterinarianId: string; date: string; time: string },
  context: BookedSlotContext
): boolean => {
  return (
    slot.veterinarianId === context.veterinarianId &&
    slot.date === context.bookedDate &&
    normalizeTime(slot.time) === context.normalizedBookedTime
  );
};

const updateCachedAvailableSlots = (
  draft: {
    slots: Array<{ veterinarianId: string; date: string; time: string }>;
  },
  context: BookedSlotContext
) => {
  draft.slots = draft.slots.filter(
    (slot) => !shouldRemoveBookedSlot(slot, context)
  );
};

const createAvailableSlotsDraftUpdater = (context: BookedSlotContext) => {
  return (draft: {
    slots: Array<{ veterinarianId: string; date: string; time: string }>;
  }) => {
    updateCachedAvailableSlots(draft, context);
  };
};

const updateCachedVetAvailableSlots = (
  draft: { slots: string[] },
  normalizedBookedTime: string
) => {
  draft.slots = draft.slots.filter(
    (slot) => normalizeTime(slot) !== normalizedBookedTime
  );
};

const createVetAvailableSlotsDraftUpdater = (normalizedBookedTime: string) => {
  return (draft: { slots: string[] }) => {
    updateCachedVetAvailableSlots(draft, normalizedBookedTime);
  };
};

const getBookedVeterinarianId = (
  booked: BookAppointmentResponse,
  fallback: string
): string =>
  'appointment' in booked
    ? (booked.appointment?.veterinarianId ?? fallback)
    : booked.veterinarianId || fallback;

const getBookedDate = (
  booked: BookAppointmentResponse,
  fallback: string
): string =>
  'appointment' in booked
    ? (booked.appointment?.dateTimeStart?.split('T')[0] ?? fallback)
    : booked.date || fallback;

const getBookedTime = (
  booked: BookAppointmentResponse,
  fallback: string
): string =>
  'appointment' in booked
    ? (booked.appointment?.dateTimeStart?.split('T')[1]?.slice(0, 5) ??
      fallback)
    : booked.time || fallback;

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Available Slots (cached per request args)
    getAvailableSlots: builder.query<
      AvailableSlotsResponse,
      AvailableSlotsRequest
    >({
      query: (data) => ({
        url: '/appointments/available-slots',
        method: 'POST',
        body: data,
      }),
      // cache data for 1 minute after last use
      keepUnusedDataFor: 60,
      // tag cached data per veterinarian + clinic so it can be invalidated precisely
      providesTags: (result) =>
        result?.slots
          ? result.slots.map((slot) => ({
              type: 'AvailableSlots' as const,
              id: slot.veterinarianId,
            }))
          : [],
    }),

    // Book Appointment
    bookAppointment: builder.mutation<
      BookAppointmentResponse,
      BookAppointmentRequest
    >({
      query: (data) => ({
        url: '/appointments',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(request, { dispatch, getState, queryFulfilled }) {
        try {
          const { data: booked } = await queryFulfilled;
          const veterinarianId = getBookedVeterinarianId(
            booked,
            request.veterinarianId
          );
          const bookedDate = getBookedDate(booked, request.date);
          const bookedTime = getBookedTime(booked, request.time);
          const normalizedBookedTime = normalizeTime(bookedTime);
          const bookedSlotContext: BookedSlotContext = {
            veterinarianId,
            bookedDate,
            normalizedBookedTime,
          };

          if (!veterinarianId) {
            return;
          }

          const invalidatedQueries = appointmentApi.util.selectInvalidatedBy(
            getState(),
            [{ type: 'AvailableSlots', id: veterinarianId }]
          );

          for (const query of invalidatedQueries) {
            if (query.endpointName !== 'getAvailableSlots') {
              continue;
            }

            dispatch(
              appointmentApi.util.updateQueryData(
                'getAvailableSlots',
                query.originalArgs as AvailableSlotsRequest,
                createAvailableSlotsDraftUpdater(bookedSlotContext)
              )
            );
          }

          dispatch(
            vetsApi.util.updateQueryData(
              'getVeterinarianAvailableSlots',
              {
                veterinarianId,
                date: bookedDate,
              } as VeterinarianAvailableSlotsRequest,
              createVetAvailableSlotsDraftUpdater(normalizedBookedTime)
            )
          );
        } catch {
          // No-op: leave server as source of truth if booking failed.
        }
      },
      invalidatesTags: (result, _error, request) => {
        const veterinarianId = result
          ? getBookedVeterinarianId(result, request.veterinarianId)
          : request.veterinarianId;
        const bookedDate = result
          ? getBookedDate(result, request.date)
          : request.date;

        return veterinarianId
          ? [
              { type: 'AvailableSlots' as const, id: veterinarianId },
              {
                type: 'VeterinarianAvailableSlots' as const,
                id: `${veterinarianId}-${bookedDate}`,
              },
              'Appointments' as const,
            ]
          : ['Appointments' as const];
      },
    }),
    getShceduledAppointments: builder.query<AppointmentsListResponse, void>({
      query: () => ({
        url: '/appointments',
        method: 'GET',
      }),
      providesTags: ['Appointments'],
    }),
    cancelAppointment: builder.mutation<AppointmentCancelResponse, string>({
      query: (appointmentId) => ({
        url: `/appointments/${appointmentId}`,
        method: 'DELETE',
        responseHandler: async (response) => {
          const text = await response.text();
          if (!text) return { message: 'Appointment cancelled successfully.' };
          try {
            return JSON.parse(text);
          } catch {
            return { message: 'Appointment cancelled successfully.' };
          }
        },
      }),
      invalidatesTags: ['Appointments'],
    }),

    rescheduleAppointment: builder.mutation<
      AppointmentRescheduleResponse,
      { appointmentId: string; newDateTime: string }
    >({
      query: ({ appointmentId, newDateTime }) => ({
        url: `/appointments/${appointmentId}/reschedule`,
        method: 'PATCH',
        body: { newDateTime },
        responseHandler: async (response) => {
          const text = await response.text();
          if (!text) return { message: 'Appointment rescheduled successfully.' };
          try {
            return JSON.parse(text);
          } catch {
            return { message: 'Appointment rescheduled successfully.' };
          }
        },
      }),
      invalidatesTags: ['Appointments'],
    }),

    getVetAvailableSlots: builder.query<
      { slots: string[] },
      { veterinarianId: string; date: string }
    >({
      query: ({ veterinarianId, date }) => ({
        url: `/veterinarians/${veterinarianId}/available-slots/${date}`,
        method: 'GET',
      }),
    }),

    getVetAvailableDates: builder.query<{ dates: string[] }, string>({
      query: (veterinarianId) => ({
        url: `/veterinarians/${veterinarianId}/available-dates`,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

// Lazy query hook is convenient for search-like behavior
export const {
  useGetAvailableSlotsQuery,
  useLazyGetAvailableSlotsQuery,
  useBookAppointmentMutation,
  useGetShceduledAppointmentsQuery,
  useCancelAppointmentMutation,
  useRescheduleAppointmentMutation,
  useGetVetAvailableSlotsQuery,
  useGetVetAvailableDatesQuery,
} = appointmentApi;
