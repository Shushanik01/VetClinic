import { baseApi } from '~/store/api/base-api';
import type {
  FeedbackCreationRequest,
  FeedbackCreationResponse,
  FeedbackUpdateRequest,
  FeedbackUpdateResponse,
} from './feedback-types';

export const feedbackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addFeedback: builder.mutation<
      FeedbackCreationResponse,
      FeedbackCreationRequest
    >({
      query: (data) => ({
        url: '/feedback',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Appointments'],
    }),

    updateFeedback: builder.mutation<
      FeedbackUpdateResponse,
      { feedbackId: string } & FeedbackUpdateRequest
    >({
      query: ({ feedbackId, ...body }) => ({
        url: `/feedback/${feedbackId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Appointments'],
    }),
  }),
  overrideExisting: false,
});

export const { useAddFeedbackMutation, useUpdateFeedbackMutation } =
  feedbackApi;
