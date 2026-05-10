import { delay, http, HttpResponse } from 'msw';
import { mockDb } from '~/mocks/data/mock-db';
import { requireAuth, requireRole } from '~/mocks/handlers/utils/auth-guard';
import type {
  AvailableSlotsRequest,
  BookAppointmentRequest,
} from '~/store/api/appointments/appointment-types';

const NETWORK_DELAY_MS = 250;

export const appointmentHandlers = [
  http.post('/appointments/available-slots', async ({ request }) => {
    const body = (await request.json()) as AvailableSlotsRequest;
    const slots = mockDb.veterinarians.getAvailableSlots({
      veterinarianSpecialty: body.veterinarianSpecialty,
      date: body.date,
      time: body.time,
      clinicId: body.clinicId,
    });

    await delay(NETWORK_DELAY_MS);
    return HttpResponse.json({ slots });
  }),

  http.get('/appointments', async ({ request }) => {
    const auth = requireAuth(request);

    if ('response' in auth) {
      return auth.response;
    }

    const roleValidation = requireRole(auth.context, [
      'Client',
      'Receptionist',
      'Admin',
    ]);

    if (roleValidation) {
      return roleValidation.response;
    }

    await delay(NETWORK_DELAY_MS);
    return HttpResponse.json({
      appointments: mockDb.appointments.getForActor(auth.context),
    });
  }),

  http.get('/appointments/:appointmentId', async ({ request, params }) => {
    const auth = requireAuth(request);

    if ('response' in auth) {
      return auth.response;
    }

    const appointment = mockDb.appointments.getByIdForActor(
      String(params.appointmentId),
      auth.context
    );

    await delay(NETWORK_DELAY_MS);

    if (appointment.status === 'not-found') {
      return HttpResponse.json(
        { message: 'Appointment not found.' },
        { status: 404 }
      );
    }

    if (appointment.status === 'forbidden') {
      return HttpResponse.json(
        { message: 'Forbidden: you can only view your own appointments.' },
        { status: 403 }
      );
    }

    if (appointment.status === 'conflict') {
      return HttpResponse.json(
        { message: 'Appointment cannot be viewed.' },
        { status: 409 }
      );
    }

    return HttpResponse.json(appointment.data);
  }),

  http.post('/appointments', async ({ request }) => {
    const auth = requireAuth(request);

    if ('response' in auth) {
      return auth.response;
    }

    const roleValidation = requireRole(auth.context, [
      'Client',
      'Receptionist',
      'Admin',
    ]);

    if (roleValidation) {
      return roleValidation.response;
    }

    const body = (await request.json()) as BookAppointmentRequest;

    if (auth.context.role === 'Client' && !('clientId' in body)) {
      return HttpResponse.json(
        { message: 'Forbidden: clients cannot create guest appointments.' },
        { status: 403 }
      );
    }

    const normalizedRequest: BookAppointmentRequest =
      'clientId' in body && auth.context.role === 'Client'
        ? { ...body, clientId: auth.context.userId }
        : body;

    const appointment = mockDb.appointments.create(normalizedRequest);

    await delay(NETWORK_DELAY_MS);

    if (appointment.status === 'not-found') {
      return HttpResponse.json(
        { message: 'Client, pet, clinic, or veterinarian not found.' },
        { status: 404 }
      );
    }

    if (appointment.status === 'conflict') {
      return HttpResponse.json(
        { message: 'Selected time slot is already booked.' },
        { status: 409 }
      );
    }

    if (appointment.status === 'forbidden') {
      return HttpResponse.json(
        { message: 'Forbidden: operation is not allowed.' },
        { status: 403 }
      );
    }

    return HttpResponse.json(
      {
        appointmentId: appointment.data.appointmentId,
        veterinarianId: appointment.data.veterinarianId,
        date: appointment.data.dateTimeStart.split('T')[0],
        time: appointment.data.dateTimeStart.split('T')[1]?.slice(0, 5),
        clinicId: normalizedRequest.clinicId,
        clinicAddress: appointment.data.location,
        petId: appointment.data.petId,
        visitReason: appointment.data.visitReason,
        status: appointment.data.status,
        confirmationMessage: 'Appointment successfully booked.',
      },
      { status: 201 }
    );
  }),

  http.delete('/appointments/:appointmentId', async ({ request, params }) => {
    const auth = requireAuth(request);

    if ('response' in auth) {
      return auth.response;
    }

    const appointmentId = String(params.appointmentId);
    const cancelled = mockDb.appointments.cancel(appointmentId, auth.context);

    await delay(NETWORK_DELAY_MS);

    if (cancelled.status === 'not-found') {
      return HttpResponse.json(
        { message: 'Appointment not found.' },
        { status: 404 }
      );
    }

    if (cancelled.status === 'forbidden') {
      return HttpResponse.json(
        { message: 'Forbidden: you can only manage your own appointments.' },
        { status: 403 }
      );
    }

    if (cancelled.status === 'conflict') {
      return HttpResponse.json(
        { message: 'Appointment cannot be cancelled.' },
        { status: 409 }
      );
    }

    return HttpResponse.json({
      message: 'Appointment cancelled successfully.',
    });
  }),

  http.patch(
    '/appointments/:appointmentId/reschedule',
    async ({ request, params }) => {
      const auth = requireAuth(request);

      if ('response' in auth) {
        return auth.response;
      }

      const appointmentId = String(params.appointmentId);
      const body = (await request.json()) as { newDateTime: string };

      const appointment = mockDb.appointments.reschedule(
        appointmentId,
        body.newDateTime,
        auth.context
      );

      await delay(NETWORK_DELAY_MS);

      if (appointment.status === 'not-found') {
        return HttpResponse.json(
          { message: 'Appointment not found.' },
          { status: 404 }
        );
      }

      if (appointment.status === 'forbidden') {
        return HttpResponse.json(
          { message: 'Forbidden: you can only manage your own appointments.' },
          { status: 403 }
        );
      }

      if (appointment.status === 'conflict') {
        return HttpResponse.json(
          { message: 'Selected new time slot is unavailable.' },
          { status: 409 }
        );
      }

      return HttpResponse.json({
        message: 'Appointment rescheduled successfully.',
      });
    }
  ),
];
