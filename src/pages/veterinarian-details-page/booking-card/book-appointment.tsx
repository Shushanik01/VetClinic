import React from 'react';
import DoctorsInfo from './doctors-info';
import DoctorsPicture from './doctors-picture';
import BookingTime from './booking-time';
import { useNavigate } from 'react-router-dom';
import type { VeterinarianProfile } from '~/store/api/vets/vets-types';

interface BookAppointmentProps {
  veterinarian: VeterinarianProfile;
  veterinarianId: string;
}

const BookAppointment: React.FC<BookAppointmentProps> = ({
  veterinarian,
  veterinarianId,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

  return (
    <div className="rounded-[32px] bg-green-400 p-8 shadow-sm flex flex-col gap-4">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="text-neutral-0 text-body-m-regular inline-flex items-center gap-2 w-fit px-3 py-2 rounded-xl cursor-pointer hover:bg-white/15 transition-colors"
      >
        ← Back
      </button>

      {/* Doctor name */}

      <h1 className="text-neutral-0 text-h2">{veterinarian.fullName}</h1>

      {/* Main content wrapper */}
      <div className="flex flex-col xl:flex-row xl:items-stretch gap-6">
        {/* Left section - Doctor picture and info */}
        <div className="flex flex-row xl:flex-col items-stretch gap-4 w-fit mx-auto xl:mx-0 shrink-0">
          <div className="w-[320px]">
            <DoctorsPicture
              fullName={veterinarian.fullName}
              imageUrl={veterinarian.imageUrl}
            />
          </div>
          <div className="w-[320px]">
            <DoctorsInfo veterinarian={veterinarian} />
          </div>
        </div>

        {/* Right section - Booking */}
          
        <div className="bg-neutral-0 flex-1 min-w-0 p-4 rounded-2xl">
          <p className="text-h3 text-black-900 mb-4">Book Appointment</p>

          {/* Booking time component */}
          <BookingTime
            veterinarianId={veterinarianId}
            veterinarianName={veterinarian.fullName}
            veterinarianSpecialty={
              veterinarian.specialty || veterinarian.specializations[0] || ''
            }
            clinicAddress={veterinarian.clinicAddress}
            clinicId={veterinarian.clinicId}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={setSelectedDate}
            onTimeSelect={setSelectedTime}
          />
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
