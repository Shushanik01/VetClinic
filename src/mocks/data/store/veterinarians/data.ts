import type { AppointmentSlot } from '~/store/api/appointments/appointment-types';
import type {
  VeterinarianProfile,
  VeterinarianFeedback,
} from '~/store/api/vets/vets-types';

export const DEFAULT_CLINIC_ADDRESS = '123 Main Street, New York, NY 10001';

export const veterinarians: VeterinarianProfile[] = [
  {
    id: 'f7g8h9i0-j1k2-3l4m-5n6o-7p8q9r0s1t2u',
    clinicId: 'clinic-1',
    fullName: 'Dr. Jennifer Lee',
    specialty: 'Surgery',
    rating: 4.9,
    reviewsCount: 132,
    clinicAddress: DEFAULT_CLINIC_ADDRESS,
    specializations: ['Surgery', 'Orthopedics'],
    languages: ['English', 'Spanish'],
    imageUrl: '/doctor.png',
    education: [
      { title: 'DVM', organization: 'Cornell University', year: '2014' },
    ],
    certifications: [
      {
        title: 'Small Animal Surgery',
        organization: 'ABVS',
        year: '2018',
      },
    ],
  },
  {
    id: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    clinicId: 'clinic-1',
    fullName: 'Dr. Sarah Wilson',
    specialty: 'General',
    rating: 4.7,
    reviewsCount: 98,
    clinicAddress: DEFAULT_CLINIC_ADDRESS,
    specializations: ['General practice', 'Wellness checks'],
    languages: ['English'],
    imageUrl: '/doctor.png',
    education: [{ title: 'DVM', organization: 'UC Davis', year: '2016' }],
    certifications: [
      {
        title: 'Companion Animal Medicine',
        organization: 'AAHA',
        year: '2019',
      },
    ],
  },
  {
    id: 'd5e6f7g8-9h0i-1j2k-3l4m-5n6o7p8q9r0s',
    clinicId: 'clinic-1',
    fullName: 'Dr. James Brown',
    specialty: 'Dentistry',
    rating: 4.8,
    reviewsCount: 87,
    clinicAddress: DEFAULT_CLINIC_ADDRESS,
    specializations: ['Dentistry', 'Oral surgery'],
    languages: ['English', 'French'],
    imageUrl: '/doctor.png',
    education: [
      {
        title: 'DVM',
        organization: 'University of Pennsylvania',
        year: '2013',
      },
    ],
    certifications: [
      {
        title: 'Veterinary Dentistry',
        organization: 'AVDC',
        year: '2020',
      },
    ],
  },
];

export const feedbackByVeterinarianId: Record<string, VeterinarianFeedback[]> =
  {
    'f7g8h9i0-j1k2-3l4m-5n6o-7p8q9r0s1t2u': [
      {
        id: 'fb-1',
        clientName: 'Alex Harper',
        petLabel: 'Bella (Dog)',
        rating: 5,
        comment: 'Very clear explanations and smooth surgery follow-up.',
        date: '2026-03-11',
      },
      {
        id: 'fb-2',
        clientName: 'Olivia Chen',
        petLabel: 'Milo (Cat)',
        rating: 4,
        comment: 'Great care, waiting time was a little longer than expected.',
        date: '2026-02-27',
      },
    ],
    'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c': [
      {
        id: 'fb-3',
        clientName: 'Noah Rivera',
        petLabel: 'Luna (Dog)',
        rating: 5,
        comment: 'Super friendly and helped us build a care routine.',
        date: '2026-03-05',
      },
    ],
    'd5e6f7g8-9h0i-1j2k-3l4m-5n6o7p8q9r0s': [
      {
        id: 'fb-4',
        clientName: 'Emma Stone',
        petLabel: 'Coco (Rabbit)',
        rating: 4,
        comment: 'Good consultation with practical recovery tips.',
        date: '2026-03-01',
      },
    ],
  };

export const availableSlots: AppointmentSlot[] = [
  {
    veterinarianSpecialty: 'Surgery',
    veterinarianName: 'Dr. Jennifer Lee',
    veterinarianId: 'f7g8h9i0-j1k2-3l4m-5n6o-7p8q9r0s1t2u',
    date: '2026-03-20',
    time: '09:00',
    clinicId: 'clinic-1',
    clinicAddress: DEFAULT_CLINIC_ADDRESS,
    bookAppointmentAvailable: true,
  },
  {
    veterinarianSpecialty: 'Surgery',
    veterinarianName: 'Dr. Jennifer Lee',
    veterinarianId: 'f7g8h9i0-j1k2-3l4m-5n6o-7p8q9r0s1t2u',
    date: '2026-03-20',
    time: '10:00',
    clinicId: 'clinic-1',
    clinicAddress: DEFAULT_CLINIC_ADDRESS,
    bookAppointmentAvailable: true,
  },
  {
    veterinarianSpecialty: 'General',
    veterinarianName: 'Dr. Sarah Wilson',
    veterinarianId: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    date: '2026-03-20',
    time: '09:30',
    clinicId: 'clinic-1',
    clinicAddress: DEFAULT_CLINIC_ADDRESS,
    bookAppointmentAvailable: true,
  },
  {
    veterinarianSpecialty: 'General',
    veterinarianName: 'Dr. Sarah Wilson',
    veterinarianId: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    date: '2026-03-22',
    time: '14:00',
    clinicId: 'clinic-1',
    clinicAddress: DEFAULT_CLINIC_ADDRESS,
    bookAppointmentAvailable: true,
  },
  {
    veterinarianSpecialty: 'Dentistry',
    veterinarianName: 'Dr. James Brown',
    veterinarianId: 'd5e6f7g8-9h0i-1j2k-3l4m-5n6o7p8q9r0s',
    date: '2026-03-21',
    time: '10:30',
    clinicId: 'clinic-1',
    clinicAddress: DEFAULT_CLINIC_ADDRESS,
    bookAppointmentAvailable: true,
  },
  {
    veterinarianSpecialty: 'Dentistry',
    veterinarianName: 'Dr. James Brown',
    veterinarianId: 'd5e6f7g8-9h0i-1j2k-3l4m-5n6o7p8q9r0s',
    date: '2026-03-21',
    time: '11:30',
    clinicId: 'clinic-1',
    clinicAddress: DEFAULT_CLINIC_ADDRESS,
    bookAppointmentAvailable: true,
  },
];

export type AvailableSlotsFilters = {
  veterinarianSpecialty?: string;
  date?: string;
  time?: string;
  clinicId?: string;
};
