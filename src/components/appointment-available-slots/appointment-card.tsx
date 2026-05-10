import { useState } from 'react';
import { useSelector } from 'react-redux';

import { AvailableSlotDetails } from './available-slot-details';
import { BookAppointmentPopup } from '~/components/book-appointment-form/book-appointment-popup';
import { LoginRequiredPopup } from '~/components/pop-up-window/login-required-popup';
import type { RootState } from '~/store/store';

type AppointmentCardProps = {
  veterinarianSpecialty: string;
  veterinarianName: string;
  veterinarianId: string;
  date: string;
  time: string;
  clinicAddress: string;
  clinicId: string;
  onBooked?: (booked: {
    veterinarianId: string;
    clinicId: string;
    date: string;
    time: string;
  }) => void;
};

export const AppointmentCard = ({
  veterinarianSpecialty,
  veterinarianName,
  veterinarianId,
  date,
  time,
  clinicAddress,
  clinicId,
  onBooked,
}: AppointmentCardProps) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showBookingPopup, setShowBookingPopup] = useState(false);

  const handleBookClick = () => {
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    setShowBookingPopup(true);
  };

  return (
    <div className="w-[380px] h-[300px] rounded-[16px] p-[24px] flex flex-col gap-[16px] bg-neutral-0 border border-green-400">
      <AvailableSlotDetails
        veterinarianSpecialty={veterinarianSpecialty}
        veterinarianName={veterinarianName}
        veterinarianId={veterinarianId}
        date={date}
        time={time}
        clinicAddress={clinicAddress}
      />

      <button
        id={`book-appointment-${veterinarianId}-${clinicId}-${date}-${time}`}
        className="btn-white-l mt-auto"
        onClick={handleBookClick}
      >
        Book Appointment
      </button>

      {showLoginPopup && (
        <LoginRequiredPopup onClose={() => setShowLoginPopup(false)} />
      )}

      {showBookingPopup && (
        <BookAppointmentPopup
          veterinarianName={veterinarianName}
          veterinarianSpecialty={veterinarianSpecialty}
          date={date}
          time={time}
          clinicAddress={clinicAddress}
          veterinarianId={veterinarianId}
          clinicId={clinicId}
          onBooked={onBooked}
          onClose={() => setShowBookingPopup(false)}
        />
      )}
    </div>
  );
};
