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

const clientCards = [
  {
    date: 'Sunday, May 10, 2026',
    time: '09:00',
    vet: 'Dr. Sarah Wilson',
    specialty: 'General',
    status: 'Scheduled',
    statusColor: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    date: 'Sunday, May 10, 2026',
    time: '11:00',
    vet: 'Dr. Jennifer Lee',
    specialty: 'Surgery',
    status: 'Scheduled',
    statusColor: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    date: 'Monday, May 11, 2026',
    time: '09:00',
    vet: 'Dr. Sarah Wilson',
    specialty: 'General',
    status: 'Scheduled',
    statusColor: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    date: 'Tuesday, May 12, 2026',
    time: '09:00',
    vet: 'Dr. James Brown',
    specialty: 'Dentistry',
    status: 'Scheduled',
    statusColor: 'bg-blue-50 text-blue-600 border-blue-200',
  },
];

const ClientPreview = () => (
  <div className="absolute inset-0 overflow-hidden rounded-4xl pointer-events-none select-none flex items-end justify-center pb-2">
    <div
      className="w-[95%] rounded-2xl bg-white shadow-2xl overflow-hidden"
      style={{ transform: 'perspective(900px) rotateX(6deg)', opacity: 0.92 }}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
        <p className="text-[10px] font-bold text-gray-800">My Appointments</p>
        <div className="bg-gray-900 rounded-full px-3 py-1">
          <span className="text-[8px] text-white font-medium">
            Book Appointment
          </span>
        </div>
      </div>

      {/* Cards grid */}
      <div className="p-2 grid grid-cols-2 gap-2 bg-gray-50">
        {clientCards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-sm flex flex-col gap-1.5"
          >
            <span
              className={`text-[7px] font-medium border rounded-full px-1.5 py-0.5 w-fit ${card.statusColor}`}
            >
              {card.status}
            </span>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm bg-gray-300 shrink-0" />
                <span className="text-[6.5px] text-gray-600 truncate">
                  {card.date}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-teal-300 shrink-0" />
                <span className="text-[6.5px] text-teal-700 font-medium truncate">
                  {card.vet}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm bg-gray-300 shrink-0" />
                <span className="text-[6.5px] text-gray-500 truncate">
                  {card.time}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm bg-gray-300 shrink-0" />
                <span className="text-[6.5px] text-gray-600 truncate">
                  {card.specialty}
                </span>
              </div>
              <div className="col-span-2 flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm bg-gray-300 shrink-0" />
                <span className="text-[6.5px] text-gray-400 truncate">
                  123 Main Street, New York, NY 10001
                </span>
              </div>
            </div>
            <div className="flex gap-1 mt-0.5">
              <div className="flex-1 bg-white border border-gray-300 rounded text-[6px] text-gray-700 text-center py-0.5">
                Cancel
              </div>
              <div className="flex-1 bg-gray-900 rounded text-[6px] text-white text-center py-0.5">
                Reschedule
              </div>
            </div>
          </div>
        ))}
      </div>
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
          <div className="relative flex-1 rounded-4xl bg-teal-600 p-6 flex flex-col justify-between gap-6 min-h-95 overflow-hidden">
            <ClientPreview />
            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-body-s-bold text-neutral-0/70 uppercase tracking-widest">
                Client
              </span>
              <h3 className="text-h2 text-neutral-0">Client Dashboard</h3>
              <p className="text-body-m-regular text-neutral-0/80">
                See all your upcoming and past appointments, track your pets'
                health history, leave feedback, and manage your bookings in one
                place.
              </p>
            </div>
            <Link
              to={ROUTES_PATH.MY_APPOINTMENTS}
              className="relative z-10 btn-white-l text-center w-full hover:bg-neutral-50 transition-colors"
            >
              View Client's Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
