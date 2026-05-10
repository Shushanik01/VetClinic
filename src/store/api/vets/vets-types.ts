export type VeterinarianQualificationItem = {
  title: string;
  organization: string;
  year: string;
};

export type VeterinarianProfile = {
  id: string;
  clinicId: string;
  fullName: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  clinicAddress: string;
  specializations: string[];
  languages: string[];
  imageUrl?: string;
  education: VeterinarianQualificationItem[];
  certifications: VeterinarianQualificationItem[];
};

export type VeterinariansListResponse = {
  veterinarians: VeterinarianProfile[];
};

export type VeterinarianFeedback = {
  id: string;
  clientName: string;
  petLabel: string;
  rating: number;
  comment: string;
  date: string;
};

export type FeedbackSort =
  | 'rating,asc'
  | 'rating,desc'
  | 'date,asc'
  | 'date,desc';

export type VeterinarianFeedbackQueryArgs = {
  veterinarianId: string;
  page?: number;
  size?: number;
  sort?: FeedbackSort;
};

export type FeedbackPageResponse = {
  content: VeterinarianFeedback[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type VeterinarianAvailableSlotsRequest = {
  veterinarianId: string;
  date: string;
};

export type VeterinarianAvailableSlotsResponse = {
  slots: string[];
};
