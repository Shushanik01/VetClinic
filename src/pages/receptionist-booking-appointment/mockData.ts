const appointments = [
  'Create an Appointment',
  'Cancel Appointment',
  'Reschedule Appointment',
];

const appointmentTitles: Record<string, string> = {
  Create: 'Create an Appointment',
  Cancel: 'Cancel Appointment',
  Reschedule: 'Reschedule Appointment',
};

const details = [
  {
    name: 'Appointment details',
    passed: false,
    now: true,
  },
  {
    name: 'Client details',

    passed: false,
    now: false,
  },
  {
    name: 'Pet details',
    passed: false,
    now: false,
  },
];

const specialtyConfig = {
  name: 'specialty',
  options: ['General', 'Surgery', 'Dentistry', 'Dermatology'],
};

const clientConfig = {
  name: 'clientId',
  options: ['Taylor Green'],
};

const petConfig = {
  name: 'petId',
  options: ['Buddy'],
};

export {
  appointments,
  details,
  appointmentTitles,
  specialtyConfig,
  clientConfig,
  petConfig,
};
