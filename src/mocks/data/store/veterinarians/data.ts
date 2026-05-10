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
      { title: 'BS in Biology', organization: 'Yale University', year: '2010' },
      {
        title: 'Surgical Residency',
        organization: 'Animal Medical Center, NYC',
        year: '2016',
      },
    ],
    certifications: [
      { title: 'Small Animal Surgery', organization: 'ABVS', year: '2018' },
      {
        title: 'Orthopedic Procedures',
        organization: 'ACVS',
        year: '2019',
      },
      {
        title: 'Advanced Anesthesia',
        organization: 'ACVAA',
        year: '2021',
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
    education: [
      { title: 'DVM', organization: 'UC Davis', year: '2016' },
      {
        title: 'BS in Animal Science',
        organization: 'Michigan State University',
        year: '2012',
      },
    ],
    certifications: [
      {
        title: 'Companion Animal Medicine',
        organization: 'AAHA',
        year: '2019',
      },
      {
        title: 'Preventive Care Specialist',
        organization: 'AVMA',
        year: '2020',
      },
      {
        title: 'Fear Free Certified Professional',
        organization: 'Fear Free',
        year: '2022',
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
      {
        title: 'Dental Residency',
        organization: 'Colorado State University',
        year: '2015',
      },
      {
        title: 'BS in Chemistry',
        organization: 'Boston University',
        year: '2009',
      },
    ],
    certifications: [
      { title: 'Veterinary Dentistry', organization: 'AVDC', year: '2020' },
      {
        title: 'Oral Radiology & Imaging',
        organization: 'AVDC',
        year: '2021',
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
      {
        id: 'fb-5',
        clientName: 'Liam Foster',
        petLabel: 'Max (Dog)',
        rating: 5,
        comment:
          'Dr. Lee is outstanding. She explained every step of the procedure and Max recovered faster than expected.',
        date: '2026-04-02',
      },
      {
        id: 'fb-6',
        clientName: 'Sophia Patel',
        petLabel: 'Nala (Cat)',
        rating: 5,
        comment:
          'Incredibly skilled surgeon. Nala had a complex orthopedic issue and Dr. Lee handled it perfectly.',
        date: '2026-04-15',
      },
      {
        id: 'fb-7',
        clientName: 'Marcus Webb',
        petLabel: 'Charlie (Dog)',
        rating: 3,
        comment:
          'Surgery went well but getting follow-up appointments was a bit difficult. Care quality itself was excellent.',
        date: '2026-01-20',
      },
      {
        id: 'fb-8',
        clientName: 'Ava Thompson',
        petLabel: 'Luna (Dog)',
        rating: 5,
        comment:
          'Best vet surgeon we have ever visited. Very thorough pre-op assessment and clear aftercare instructions.',
        date: '2026-03-28',
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
      {
        id: 'fb-9',
        clientName: 'Chloe Kim',
        petLabel: 'Peanut (Hamster)',
        rating: 4,
        comment:
          'Dr. Wilson was patient and thorough. She took time to explain the wellness plan in detail.',
        date: '2026-02-14',
      },
      {
        id: 'fb-10',
        clientName: 'Ethan Brooks',
        petLabel: 'Rocky (Dog)',
        rating: 5,
        comment:
          'Always professional and kind. Rocky actually enjoys his visits now, which says a lot!',
        date: '2026-04-10',
      },
      {
        id: 'fb-11',
        clientName: 'Isabella Cruz',
        petLabel: 'Simba (Cat)',
        rating: 4,
        comment:
          'Very knowledgeable. She caught an issue during a routine check that we had completely missed.',
        date: '2026-01-30',
      },
      {
        id: 'fb-12',
        clientName: 'James Nguyen',
        petLabel: 'Buddy (Dog)',
        rating: 5,
        comment:
          'Excellent general vet. Her recommendations for diet and exercise made a noticeable difference.',
        date: '2026-03-22',
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
      {
        id: 'fb-13',
        clientName: 'Ryan Mitchell',
        petLabel: 'Daisy (Dog)',
        rating: 5,
        comment:
          'Dr. Brown is a true specialist. Daisy had severe dental disease and he resolved it completely.',
        date: '2026-04-05',
      },
      {
        id: 'fb-14',
        clientName: 'Grace Sullivan',
        petLabel: 'Whiskers (Cat)',
        rating: 5,
        comment:
          'Thorough dental cleaning and he showed us X-rays to explain exactly what was happening. Very impressive.',
        date: '2026-02-18',
      },
      {
        id: 'fb-15',
        clientName: 'Daniel Park',
        petLabel: 'Oreo (Cat)',
        rating: 4,
        comment:
          'Great expertise in dental procedures. Post-op recovery instructions were clear and helpful.',
        date: '2026-03-14',
      },
    ],
  };

type VetSchedule = {
  veterinarianSpecialty: string;
  veterinarianName: string;
  veterinarianId: string;
  clinicId: string;
  /** ISO weekday numbers: 1=Mon … 5=Fri */
  workDays: number[];
  times: string[];
};

const vetSchedules: VetSchedule[] = [
  {
    veterinarianSpecialty: 'Surgery',
    veterinarianName: 'Dr. Jennifer Lee',
    veterinarianId: 'f7g8h9i0-j1k2-3l4m-5n6o-7p8q9r0s1t2u',
    clinicId: 'clinic-1',
    workDays: [1, 3, 5], // Mon, Wed, Fri
    times: ['09:00', '11:00', '14:00'],
  },
  {
    veterinarianSpecialty: 'General',
    veterinarianName: 'Dr. Sarah Wilson',
    veterinarianId: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    clinicId: 'clinic-1',
    workDays: [1, 2, 3, 4, 5], // Mon–Fri
    times: ['09:00', '09:30', '10:00', '11:00', '14:00', '14:30', '15:00'],
  },
  {
    veterinarianSpecialty: 'Dentistry',
    veterinarianName: 'Dr. James Brown',
    veterinarianId: 'd5e6f7g8-9h0i-1j2k-3l4m-5n6o7p8q9r0s',
    clinicId: 'clinic-1',
    workDays: [2, 4], // Tue, Thu
    times: ['09:00', '10:30', '13:00', '14:30'],
  },
];

function generateAvailableSlots(): AppointmentSlot[] {
  const slots: AppointmentSlot[] = [];
  const pad = (n: number) => String(n).padStart(2, '0');

  const start = new Date();
  start.setDate(start.getDate() + 1); // start from tomorrow
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setMonth(end.getMonth() + 13); // 13 months ahead

  const current = new Date(start);

  while (current <= end) {
    const dow = current.getDay(); // 0=Sun … 6=Sat
    const dateStr = `${current.getFullYear()}-${pad(current.getMonth() + 1)}-${pad(current.getDate())}`;

    for (const vet of vetSchedules) {
      if (vet.workDays.includes(dow)) {
        for (const time of vet.times) {
          slots.push({
            veterinarianSpecialty: vet.veterinarianSpecialty,
            veterinarianName: vet.veterinarianName,
            veterinarianId: vet.veterinarianId,
            date: dateStr,
            time,
            clinicId: vet.clinicId,
            clinicAddress: DEFAULT_CLINIC_ADDRESS,
            bookAppointmentAvailable: true,
          });
        }
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return slots;
}

export const availableSlots: AppointmentSlot[] = generateAvailableSlots();

export type AvailableSlotsFilters = {
  veterinarianSpecialty?: string;
  date?: string;
  time?: string;
  clinicId?: string;
};
