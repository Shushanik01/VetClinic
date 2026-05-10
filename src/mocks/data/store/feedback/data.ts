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
  {
    feedbackId: 'fdbk-1004',
    appointmentId: 'apt-2001',
    ownerUserId: 'client-2',
    clientName: 'Jordan Mills',
    date: '2026-04-03',
    comment:
      'Dr. Lee was wonderful with our anxious dog. Very patient and reassuring throughout.',
    rating: 5,
  },
  {
    feedbackId: 'fdbk-1005',
    appointmentId: 'apt-2002',
    ownerUserId: 'client-2',
    clientName: 'Jordan Mills',
    date: '2026-02-20',
    comment:
      'Good experience overall. The waiting area was a bit crowded but the consultation was thorough.',
    rating: 4,
  },
  {
    feedbackId: 'fdbk-1006',
    appointmentId: 'apt-3001',
    ownerUserId: 'client-3',
    clientName: 'Morgan Hayes',
    date: '2026-04-18',
    comment:
      'Incredible team. My cat had an emergency and they handled it calmly and professionally.',
    rating: 5,
  },
  {
    feedbackId: 'fdbk-1007',
    appointmentId: 'apt-3002',
    ownerUserId: 'client-3',
    clientName: 'Morgan Hayes',
    date: '2026-03-07',
    comment:
      'Routine check-up went smoothly. Appreciated the detailed health report they provided.',
    rating: 5,
  },
  {
    feedbackId: 'fdbk-1008',
    appointmentId: 'apt-4001',
    ownerUserId: 'client-4',
    clientName: 'Casey Reid',
    date: '2026-01-25',
    comment:
      'Felt a bit rushed during the appointment. The advice was helpful but more time would have been nice.',
    rating: 3,
  },
  {
    feedbackId: 'fdbk-1009',
    appointmentId: 'apt-4002',
    ownerUserId: 'client-4',
    clientName: 'Casey Reid',
    date: '2026-04-09',
    comment:
      'Second visit was much better. The vet remembered our pet and that personal touch really matters.',
    rating: 5,
  },
  {
    feedbackId: 'fdbk-1010',
    appointmentId: 'apt-5001',
    ownerUserId: 'client-5',
    clientName: 'Riley Summers',
    date: '2026-02-05',
    comment:
      'Very knowledgeable about exotic pets. Rare to find a vet so comfortable with rabbits.',
    rating: 5,
  },
  {
    feedbackId: 'fdbk-1011',
    appointmentId: 'apt-5002',
    ownerUserId: 'client-5',
    clientName: 'Riley Summers',
    date: '2025-11-30',
    comment:
      'Post-surgery recovery instructions were clear and my pet healed without any complications.',
    rating: 4,
  },
  {
    feedbackId: 'fdbk-1012',
    appointmentId: 'apt-6001',
    ownerUserId: 'client-6',
    clientName: 'Drew Calloway',
    date: '2026-03-29',
    comment:
      'Professional and friendly. The dental cleaning was done thoroughly and pricing was transparent.',
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
