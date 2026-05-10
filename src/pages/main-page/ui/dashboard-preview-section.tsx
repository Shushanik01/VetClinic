import { Link } from 'react-router-dom';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

const rows = [
  {
    client: 'Taylor Green',
    pet: 'Buddy',
    age: '4 yrs',
    vet: 'Dr. Sarah Wilson',
    specialty: 'General',
    date: 'May 10, 09:00',
  },
  {
    client: 'Jordan Miller',
    pet: 'Max',
    age: '3 yrs',
    vet: 'Dr. Jennifer Lee',
    specialty: 'Surgery',
    date: 'May 10, 11:00',
  },
  {
    client: 'Emma Davis',
    pet: 'Nala',
    age: '5 yrs',
    vet: 'Dr. James Brown',
    specialty: 'Dentistry',
    date: 'May 10, 14:00',
  },
  {
    client: 'Noah Carter',
    pet: 'Charlie',
    age: '6 yrs',
    vet: 'Dr. Sarah Wilson',
    specialty: 'General',
    date: 'May 11, 09:00',
  },
  {
    client: 'Olivia Kim',
    pet: 'Coco',
    age: '4 yrs',
    vet: 'Dr. Jennifer Lee',
    specialty: 'Surgery',
    date: 'May 11, 11:00',
  },
];

const ReceptionistPreview = () => (
  <div className="absolute inset-0 overflow-hidden rounded-4xl pointer-events-none select-none flex items-end justify-center pb-2">
    <div
      className="w-[95%] rounded-2xl bg-white shadow-2xl overflow-hidden"
      style={{ transform: 'perspective(900px) rotateX(6deg)', opacity: 0.92 }}
    >
      {/* Dashboard header bar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-gray-800">Appointments</p>
          <p className="text-[8px] text-gray-400">22 booked appointments</p>
        </div>
        <div className="bg-gray-900 rounded-full px-3 py-1">
          <span className="text-[8px] text-white font-medium">
            Create an Appointment
          </span>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1.4fr_0.8fr_0.6fr_1.2fr_1.3fr_0.8fr_1.1fr_0.8fr_0.4fr] bg-gray-50 border-b border-gray-200 px-3 py-1.5 gap-1">
        {[
          'Client Name',
          'Pet Name',
          'Pet Age',
          'Veterinarian',
          'Clinic Address',
          'Specialty',
          'Date & Time',
          'Status',
          '',
        ].map((h) => (
          <span
            key={h}
            className="text-[7px] font-bold text-gray-500 uppercase tracking-wide truncate"
          >
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <div
          key={row.client}
          className={`grid grid-cols-[1.4fr_0.8fr_0.6fr_1.2fr_1.3fr_0.8fr_1.1fr_0.8fr_0.4fr] px-3 py-2 gap-1 items-center border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
        >
          <span className="text-[8px] text-gray-800 font-medium truncate">
            {row.client}
          </span>
          <span className="text-[8px] text-gray-600 truncate">{row.pet}</span>
          <span className="text-[8px] text-gray-500">{row.age}</span>
          <span className="text-[8px] text-gray-600 truncate">{row.vet}</span>
          <span className="text-[8px] text-gray-400 truncate">
            123 Main St, NY…
          </span>
          <span className="text-[8px] text-gray-600 truncate">
            {row.specialty}
          </span>
          <span className="text-[8px] text-gray-600 truncate">{row.date}</span>
          <span className="text-[7px] font-medium bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-1.5 py-0.5 w-fit">
            Scheduled
          </span>
          <div className="flex gap-0.5">
            <div className="w-3.5 h-3.5 rounded bg-teal-100 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-sm" />
            </div>
            <div className="w-3.5 h-3.5 rounded bg-red-100 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-sm" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ClientPreview = () => (
  <div className="absolute inset-0 overflow-hidden rounded-4xl opacity-20 pointer-events-none select-none">
    <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
      {[
        {
          pet: 'Bella (Dog)',
          vet: 'Dr. Jennifer Lee',
          date: 'May 14',
          time: '09:00',
          badge: 'Surgery',
        },
        {
          pet: 'Milo (Cat)',
          vet: 'Dr. Sarah Wilson',
          date: 'May 19',
          time: '10:00',
          badge: 'General',
        },
        {
          pet: 'Coco (Rabbit)',
          vet: 'Dr. James Brown',
          date: 'May 22',
          time: '13:00',
          badge: 'Dentistry',
        },
      ].map((card) => (
        <div
          key={card.pet}
          className="bg-white/20 rounded-xl px-3 py-2 flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center shrink-0">
            <span className="text-[10px] text-white font-bold">
              {card.pet[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-bold text-white truncate">
              {card.pet}
            </p>
            <p className="text-[8px] text-white/80 truncate">{card.vet}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[9px] text-white">{card.date}</p>
            <p className="text-[8px] text-white/80">{card.time}</p>
          </div>
          <span className="text-[8px] bg-white/30 text-white px-1.5 py-0.5 rounded-full shrink-0">
            {card.badge}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const DashboardPreviewSection = () => {
  return (
    <section className="w-full mt-4">
      <div className="w-full bg-neutral-0 rounded-4xl p-6 md:p-8 lg:p-12 flex flex-col gap-6">
        <div>
          <h2 className="text-h2 mb-2">Explore Our Dashboards</h2>
          <p className="text-body-m-regular text-black-800">
            Tailored views for every role — manage appointments or track your
            pet's care
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Receptionist Dashboard */}
          <div className="relative flex-1 rounded-4xl bg-green-400 p-6 flex flex-col justify-between gap-6 min-h-95 overflow-hidden">
            <ReceptionistPreview />
            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-body-s-bold text-neutral-0/70 uppercase tracking-widest">
                Staff
              </span>
              <h3 className="text-h2 text-neutral-0">Receptionist Dashboard</h3>
              <p className="text-body-m-regular text-neutral-0/80">
                Manage all clinic appointments, view daily schedules, reschedule
                or cancel bookings, and keep track of client and patient
                records.
              </p>
            </div>
            <Link
              to={ROUTES_PATH.RECEPTIONIST_BOOKING}
              className="relative z-10 btn-white-l text-center w-full hover:bg-neutral-50 transition-colors"
            >
              View Receptionist Dashboard
            </Link>
          </div>

          {/* Client Dashboard */}
          <div className="relative flex-1 rounded-4xl bg-neutral-0 border border-green-400 p-6 flex flex-col justify-between gap-6 min-h-[320px] overflow-hidden">
            <ClientPreview />
            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-body-s-bold text-black-700/60 uppercase tracking-widest">
                Client
              </span>
              <h3 className="text-h2 text-black-900">Client Dashboard</h3>
              <p className="text-body-m-regular text-black-800">
                See all your upcoming and past appointments, track your pets'
                health history, leave feedback, and manage your bookings in one
                place.
              </p>
            </div>
            <Link
              to={ROUTES_PATH.MY_APPOINTMENTS}
              className="relative z-10 btn-regular-l text-center w-full hover:brightness-95 transition-all"
            >
              View Client's Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
