import { Link } from 'react-router-dom';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

const ReceptionistPreview = () => (
  <div className="absolute inset-0 overflow-hidden rounded-4xl opacity-20 pointer-events-none select-none">
    <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
      {/* Table header */}
      <div className="flex gap-2 px-3 py-1.5 bg-white/30 rounded-lg">
        <span className="flex-1 text-[9px] font-bold text-white">Client</span>
        <span className="w-16 text-[9px] font-bold text-white">Date</span>
        <span className="w-12 text-[9px] font-bold text-white">Time</span>
        <span className="w-14 text-[9px] font-bold text-white">Status</span>
      </div>
      {/* Table rows */}
      {[
        {
          name: 'Emma Davis',
          date: 'May 12',
          time: '09:00',
          status: 'Confirmed',
          statusColor: 'bg-green-300',
        },
        {
          name: 'Noah Carter',
          date: 'May 12',
          time: '10:30',
          status: 'Pending',
          statusColor: 'bg-yellow-300',
        },
        {
          name: 'Olivia Kim',
          date: 'May 12',
          time: '11:00',
          status: 'Confirmed',
          statusColor: 'bg-green-300',
        },
        {
          name: 'Liam Foster',
          date: 'May 12',
          time: '14:00',
          status: 'Cancelled',
          statusColor: 'bg-red-300',
        },
        {
          name: 'Ava Johnson',
          date: 'May 13',
          time: '09:30',
          status: 'Confirmed',
          statusColor: 'bg-green-300',
        },
      ].map((row) => (
        <div
          key={row.name}
          className="flex gap-2 px-3 py-1.5 bg-white/20 rounded-lg items-center"
        >
          <span className="flex-1 text-[9px] text-white truncate">
            {row.name}
          </span>
          <span className="w-16 text-[9px] text-white">{row.date}</span>
          <span className="w-12 text-[9px] text-white">{row.time}</span>
          <span
            className={`w-14 text-[9px] text-white px-1.5 py-0.5 rounded-full ${row.statusColor} text-black/70 text-center`}
          >
            {row.status}
          </span>
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
          <div className="relative flex-1 rounded-4xl bg-green-400 p-6 flex flex-col justify-between gap-6 min-h-[320px] overflow-hidden">
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
