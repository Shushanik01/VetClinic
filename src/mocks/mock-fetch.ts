// const originalFetch = window.fetch;

// window.fetch = async (input, init) => {
//   const url = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input);
//   const method = (init?.method ?? 'GET').toUpperCase();

//   if (method === 'POST' && url.includes('/appointments/available-slots')) {
//     const body = JSON.parse(init?.body as string ?? '{}');
//     const requestedSpecialty = (body.veterinarianSpecialty ?? '').toLowerCase();
//     const allSlots = [
//       { veterinarianSpecialty: 'Surgery', veterinarianName: 'Dr. Jennifer Lee', veterinarianId: 'f7g8h9i0-j1k2-3l4m-5n6o-7p8q9r0s1t2u', date: '2026-03-20', time: '09:00', clinicId: 'clinic-1', clinicAddress: '123 Main Street, New York, NY 10001', bookAppointmentAvailable: true },
//       { veterinarianSpecialty: 'Surgery', veterinarianName: 'Dr. Jennifer Lee', veterinarianId: 'f7g8h9i0-j1k2-3l4m-5n6o-7p8q9r0s1t2u', date: '2026-03-20', time: '10:00', clinicId: 'clinic-1', clinicAddress: '123 Main Street, New York, NY 10001', bookAppointmentAvailable: true },
//       { veterinarianSpecialty: 'Surgery', veterinarianName: 'Dr. Jennifer Lee', veterinarianId: 'f7g8h9i0-j1k2-3l4m-5n6o-7p8q9r0s1t2u', date: '2026-03-21', time: '11:00', clinicId: 'clinic-1', clinicAddress: '123 Main Street, New York, NY 10001', bookAppointmentAvailable: true },
//       { veterinarianSpecialty: 'General', veterinarianName: 'Dr. Sarah Wilson', veterinarianId: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', date: '2026-03-20', time: '09:30', clinicId: 'clinic-1', clinicAddress: '123 Main Street, New York, NY 10001', bookAppointmentAvailable: true },
//       { veterinarianSpecialty: 'General', veterinarianName: 'Dr. Sarah Wilson', veterinarianId: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', date: '2026-03-22', time: '14:00', clinicId: 'clinic-1', clinicAddress: '123 Main Street, New York, NY 10001', bookAppointmentAvailable: true },
//       { veterinarianSpecialty: 'Dentistry', veterinarianName: 'Dr. James Brown', veterinarianId: 'd5e6f7g8-9h0i-1j2k-3l4m-5n6o7p8q9r0s', date: '2026-03-21', time: '10:30', clinicId: 'clinic-1', clinicAddress: '123 Main Street, New York, NY 10001', bookAppointmentAvailable: true },
//       { veterinarianSpecialty: 'Dentistry', veterinarianName: 'Dr. James Brown', veterinarianId: 'd5e6f7g8-9h0i-1j2k-3l4m-5n6o7p8q9r0s', date: '2026-03-21', time: '11:30', clinicId: 'clinic-1', clinicAddress: '123 Main Street, New York, NY 10001', bookAppointmentAvailable: true },
//       { veterinarianSpecialty: 'Dermatology', veterinarianName: 'Dr. Robert Taylor', veterinarianId: 'e6f7g8h9-i0j1-2k3l-4m5n-6o7p8q9r0s1t', date: '2026-03-22', time: '09:00', clinicId: 'clinic-1', clinicAddress: '123 Main Street, New York, NY 10001', bookAppointmentAvailable: true },
//       { veterinarianSpecialty: 'Dermatology', veterinarianName: 'Dr. Robert Taylor', veterinarianId: 'e6f7g8h9-i0j1-2k3l-4m5n-6o7p8q9r0s1t', date: '2026-03-23', time: '15:00', clinicId: 'clinic-1', clinicAddress: '123 Main Street, New York, NY 10001', bookAppointmentAvailable: true },
//     ];
//     const slots = requestedSpecialty
//       ? allSlots.filter(s => s.veterinarianSpecialty.toLowerCase() === requestedSpecialty)
//       : allSlots;
//     return new Response(JSON.stringify({ slots }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   if (method === 'GET' && url.includes('/veterinarians')) {
//     return new Response(JSON.stringify({ slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00'] }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   return originalFetch(input, init as RequestInit);
// };
