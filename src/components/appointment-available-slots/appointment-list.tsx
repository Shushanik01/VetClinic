import { AppointmentCard } from './appointment-card';
import { AppointmentLoader } from './appointment-loader';
import NothingFoundIcon from '~/assets/svg/icons/nothing-found-icon.svg?react';

type Appointment = {
  veterinarianSpecialty: string;
  veterinarianName: string;
  veterinarianId: string;
  date: string;
  time: string;
  clinicAddress: string;
  clinicId: string;
};

type AppointmentListProps = {
  appointments: Appointment[];
  show: boolean;
  isLoading?: boolean;
  onResetFilters?: () => void;
  onBooked?: (booked: {
    veterinarianId: string;
    clinicId: string;
    date: string;
    time: string;
  }) => void;
};

export const AppointmentList = ({
  appointments,
  show,
  isLoading = false,
  onResetFilters,
  onBooked,
}: AppointmentListProps) => {
  if (!show && !isLoading) {
    return null;
  }

  // Show loading spinner
  if (isLoading) {
    return <AppointmentLoader />;
  }

  // Show empty state when no appointments found
  if (appointments.length === 0) {
    return (
      <div className="w-full h-[396px] rounded-[16px] p-[24px] flex flex-col items-center justify-center gap-[20px] bg-neutral-0 border border-neutral-200">
        <NothingFoundIcon className="w-[68px] h-[68px]" />
        <p className="text-body-m-regular text-black-900">
          No slots available for the selected criteria
        </p>
        <button onClick={onResetFilters} className="btn-white-l">
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[396px] rounded-[16px] p-[24px] flex flex-col gap-[24px] bg-neutral-0 border border-neutral-200">
      {/* Available Slots Header */}
      <div>
        <h3 className="text-h3 text-black-900">Available Appointments</h3>
        <p className="text-body-m-regular text-neutral-600">
          {appointments.length} slots available
        </p>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(378px,1fr))] gap-6">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={`${appointment.veterinarianId}-${appointment.clinicId}-${appointment.date}-${appointment.time}`}
            veterinarianSpecialty={appointment.veterinarianSpecialty}
            veterinarianName={appointment.veterinarianName}
            veterinarianId={appointment.veterinarianId}
            date={appointment.date}
            time={appointment.time}
            clinicAddress={appointment.clinicAddress}
            clinicId={appointment.clinicId}
            onBooked={onBooked}
          />
        ))}
      </div>
    </div>
  );
};
