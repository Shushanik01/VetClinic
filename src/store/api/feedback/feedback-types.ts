export type FeedbackCreationRequest = {
  appointmentId: string;
  comment: string;
  rating: number;
};

export type FeedbackCreationResponse = {
  feedbackId: string;
  message: string;
};

export type FeedbackUpdateRequest = {
  comment: string;
  rating: number;
};

export type FeedbackUpdateResponse = {
  message: string;
};
