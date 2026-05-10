import type { BookAppointmentRequest } from '~/store/api/appointments/appointment-types';
import { veterinariansEntity } from '~/mocks/data/store/veterinarians';
import { petsEntity } from '~/mocks/data/store/pets';
import { addMinutes, deepClone, toDateTime } from '~/mocks/data/utils';
import {
  appointments,
  canManageAppointment,
  DEFAULT_SLOT_DURATION_MINUTES,
  DEFAULT_CLINIC_ADDRESS,
  findById,
  isStaffRole,
  resolveClientFirstName,
  resolveClientId,
  resolveClientLastName,
} from './data';
import type { AppointmentActor, MutationResult } from './data';

export const appointmentsEntity = {
  getForActor: (actor: AppointmentActor) => {
    if (isStaffRole(actor.role)) {
      return deepClone(appointments);
    }

    if (actor.role === 'Client') {
      return deepClone(
        appointments.filter(
          (appointment) => appointment.clientId === actor.userId
        )
      );
    }

    return [];
  },

  getByIdForActor: (
    appointmentId: string,
    actor: AppointmentActor
  ): MutationResult<any> => {
    const appointment = findById(appointmentId);

    if (!appointment) {
      return { status: 'not-found' };
    }

    if (!canManageAppointment(appointment, actor)) {
      return { status: 'forbidden' };
    }

    return { status: 'ok', data: deepClone(appointment) };
  },

  create: (payload: BookAppointmentRequest): MutationResult<any> => {
    const veterinarian = veterinariansEntity.getById(payload.veterinarianId);
    const clientFirstName = resolveClientFirstName(payload);
    const clientLastName = resolveClientLastName(payload);

    let petId: string;
    let petName: string | undefined;
    let petBirthDate: string | undefined;
    let petSpecies: string | undefined;

    if (!veterinarian) {
      return { status: 'not-found' };
    }

    if (typeof payload.petId === 'string' && payload.petId.length > 0) {
      petId = payload.petId;

      if ('clientId' in payload) {
        const existingPet = petsEntity
          .listByUserId(payload.clientId)
          .find((pet) => pet.petId === payload.petId);

        if (!existingPet) {
          return { status: 'not-found' };
        }

        petName = existingPet.petName;
        petBirthDate = existingPet.petBirthDate ?? undefined;
        petSpecies = existingPet.petSpecies;
      }
    } else if (
      typeof payload.petName === 'string' &&
      typeof payload.petSpecies === 'string' &&
      typeof payload.petBirthDate === 'string'
    ) {
      petName = payload.petName;
      petBirthDate = payload.petBirthDate;
      petSpecies = payload.petSpecies;

      if ('clientId' in payload) {
        const createdPet = petsEntity.create(payload.clientId, {
          petName: payload.petName,
          petSpecies: payload.petSpecies,
          petBirthDate: payload.petBirthDate,
          petBreed: null,
          petSex: null,
        });
        petId = createdPet.petId;
      } else {
        petId = `pet-${crypto.randomUUID().slice(0, 8)}`;
      }
    } else {
      return { status: 'not-found' };
    }

    if (
      !veterinariansEntity.hasAvailableSlot(
        payload.veterinarianId,
        payload.date,
        payload.time
      )
    ) {
      return { status: 'conflict' };
    }

    const appointment = {
      appointmentId: `apt-${crypto.randomUUID().slice(0, 8)}`,
      dateTimeStart: toDateTime(payload.date, payload.time),
      dateTimeEnd: toDateTime(
        payload.date,
        addMinutes(payload.time, DEFAULT_SLOT_DURATION_MINUTES)
      ),
      clientId: resolveClientId(payload),
      clientFirstName,
      clientLastName,
      veterinarianSpecialty: veterinarian?.specialty,
      veterinarianId: payload.veterinarianId,
      veterinarianName: veterinarian?.fullName,
      location: veterinarian?.clinicAddress ?? DEFAULT_CLINIC_ADDRESS,
      petId,
      petSpecies,
      petName,
      petBirthDate,
      visitReason: payload.visitReason,
      status: 'Scheduled' as const,
    };

    appointments.unshift(appointment);
    veterinariansEntity.consumeAvailableSlot(
      payload.veterinarianId,
      payload.date,
      payload.time
    );

    return { status: 'ok', data: deepClone(appointment) };
  },

  cancel: (
    appointmentId: string,
    actor: AppointmentActor
  ): MutationResult<null> => {
    const index = appointments.findIndex(
      (appointment) => appointment.appointmentId === appointmentId
    );

    if (index < 0) {
      return { status: 'not-found' };
    }

    if (!canManageAppointment(appointments[index], actor)) {
      return { status: 'forbidden' };
    }

    if (appointments[index].status !== 'Scheduled') {
      return { status: 'conflict' };
    }

    appointments[index].status = 'Canceled';
    return { status: 'ok', data: null };
  },

  reschedule: (
    appointmentId: string,
    newDateTime: string,
    actor: AppointmentActor
  ): MutationResult<any> => {
    const appointment = findById(appointmentId);

    if (!appointment) {
      return { status: 'not-found' };
    }

    if (!canManageAppointment(appointment, actor)) {
      return { status: 'forbidden' };
    }

    if (appointment.status !== 'Scheduled') {
      return { status: 'conflict' };
    }

    const nextDate = newDateTime.split('T')[0];
    const nextTime = newDateTime.split('T')[1]?.slice(0, 5) ?? '09:00';

    if (
      !veterinariansEntity.hasAvailableSlot(
        appointment.veterinarianId,
        nextDate,
        nextTime
      )
    ) {
      return { status: 'conflict' };
    }

    appointment.dateTimeStart = newDateTime;
    appointment.dateTimeEnd = toDateTime(
      nextDate,
      addMinutes(nextTime, DEFAULT_SLOT_DURATION_MINUTES)
    );

    veterinariansEntity.consumeAvailableSlot(
      appointment.veterinarianId,
      nextDate,
      nextTime
    );

    return { status: 'ok', data: deepClone(appointment) };
  },
};
