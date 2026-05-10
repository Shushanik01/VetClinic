import { appointmentsEntity } from '~/mocks/data/store/appointments';
import { compareDateStrings, deepClone } from '~/mocks/data/utils';
import { feedbacks, toPage } from './data';
import type { FeedbackSort } from './data';

type FeedbackRecord = (typeof feedbacks)[0];

export const feedbackEntity = {
  listPublic: (page = 0, size = 10, sort: FeedbackSort = 'date,desc') => {
    const [field, direction] = sort.split(',') as [
      'rating' | 'date',
      'asc' | 'desc',
    ];

    const sorted = [...feedbacks].sort((first, second) => {
      const base =
        field === 'rating'
          ? first.rating - second.rating
          : compareDateStrings(first.date, second.date);

      return direction === 'asc' ? base : -base;
    });

    return toPage(sorted, page, size);
  },

  getById: (feedbackId: string) => {
    const item = feedbacks.find(
      (feedback) => feedback.feedbackId === feedbackId
    );

    if (!item) {
      return null;
    }

    return deepClone({
      feedbackId: item.feedbackId,
      clientName: item.clientName,
      date: item.date,
      message: item.comment,
      rating: String(item.rating),
    });
  },

  create: (
    ownerUserId: string,
    payload: { appointmentId: string; comment: string; rating: number }
  ):
    | { status: 'ok'; data: { feedbackId: string; message: string } }
    | { status: 'not-found' } => {
    const appointment = appointmentsEntity.getByIdForActor(
      payload.appointmentId,
      {
        userId: ownerUserId,
        role: 'Client',
      }
    );

    if (appointment.status !== 'ok') {
      return { status: 'not-found' };
    }

    const created: FeedbackRecord = {
      feedbackId: `fdbk-${crypto.randomUUID().slice(0, 8)}`,
      appointmentId: payload.appointmentId,
      ownerUserId,
      clientName:
        [appointment.data.clientFirstName, appointment.data.clientLastName]
          .filter(Boolean)
          .join(' ') || 'Anonymous',
      date: new Date().toISOString().split('T')[0],
      comment: payload.comment,
      rating: payload.rating,
    };

    feedbacks.unshift(created);

    return {
      status: 'ok',
      data: {
        feedbackId: created.feedbackId,
        message: 'Feedback added successfully.',
      },
    };
  },

  update: (
    feedbackId: string,
    actor: { userId: string; role: string },
    payload: { comment: string; rating: number }
  ):
    | { status: 'ok'; data: { message: string } }
    | { status: 'not-found' }
    | { status: 'forbidden' } => {
    const item = feedbacks.find(
      (feedback) => feedback.feedbackId === feedbackId
    );

    if (!item) {
      return { status: 'not-found' };
    }

    const canEdit =
      item.ownerUserId === actor.userId ||
      actor.role === 'Admin' ||
      actor.role === 'Receptionist';

    if (!canEdit) {
      return { status: 'forbidden' };
    }

    item.comment = payload.comment;
    item.rating = payload.rating;
    item.date = new Date().toISOString().split('T')[0];

    return {
      status: 'ok',
      data: {
        message: 'Feedback information has been successfully updated.',
      },
    };
  },
};
