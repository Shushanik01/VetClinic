type FeedbackRecord = {
  feedbackId: string;
  appointmentId: string;
  ownerUserId: string;
  clientName: string;
  date: string;
  comment: string;
  rating: number;
};

export type FeedbackSort =
  | 'rating,asc'
  | 'rating,desc'
  | 'date,asc'
  | 'date,desc';

export const feedbacks: FeedbackRecord[] = [
  {
    feedbackId: 'fdbk-1001',
    appointmentId: 'apt-1001',
    ownerUserId: 'client-1',
    clientName: 'Taylor Green',
    date: '2026-03-15',
    comment: 'Very caring staff and clear instructions.',
    rating: 5,
  },
  {
    feedbackId: 'fdbk-1002',
    appointmentId: 'apt-1007',
    ownerUserId: 'client-1',
    clientName: 'Taylor Green',
    date: '2026-01-11',
    comment: 'Excellent follow-up visit, Buddy recovered quickly.',
    rating: 5,
  },
  {
    feedbackId: 'fdbk-1003',
    appointmentId: 'apt-1008',
    ownerUserId: 'client-1',
    clientName: 'Taylor Green',
    date: '2025-12-19',
    comment: 'Helpful advice and clear post-treatment instructions.',
    rating: 4,
  },
];

// Helper function
export const toPage = (
  items: FeedbackRecord[],
  page: number,
  size: number
): {
  content: Array<{
    feedbackId: string;
    clientName: string;
    date: string;
    message: string;
    rating: string;
  }>;
  currentPage: number;
  totalElements: number;
  totalPages: number;
} => {
  const offset = page * size;
  const content = items.slice(offset, offset + size);

  return {
    content: content.map((item) => ({
      feedbackId: item.feedbackId,
      clientName: item.clientName,
      date: item.date,
      message: item.comment,
      rating: String(item.rating),
    })),
    currentPage: page,
    totalElements: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / size)),
  };
};
