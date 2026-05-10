import { AvailableSlotsSearch } from '~/components/appointment-available-slots/available-slots-search';
import { AppointmentList } from '~/components/appointment-available-slots/appointment-list';
import { useRef, useState } from 'react';
import { useLazyGetAvailableSlotsQuery } from '~/store/api/appointments/appointment-api';
import type { AvailableSlotsSearchFormValues } from '~/components/appointment-available-slots/available-slots-search-schema';
import { resolveClinicIdByAddress } from '~/constants/clinics-location';

type Appointment = {
  veterinarianSpecialty: string;
  veterinarianName: string;
  veterinarianId: string;
  date: string;
  time: string;
  clinicAddress: string;
  clinicId: string;
};

export const BookAppointmentPage = () => {
  const formResetRef = useRef<(() => void) | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showList, setShowList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [triggerGetAvailableSlots] = useLazyGetAvailableSlotsQuery();
  const MIN_LOADING_TIME_MS = 400;

  const handleBookedSlot = (booked: {
    veterinarianId: string;
    clinicId: string;
    date: string;
    time: string;
  }) => {
    setAppointments((prev) =>
      prev.filter(
        (appointment) =>
          !(
            appointment.veterinarianId === booked.veterinarianId &&
            appointment.clinicId === booked.clinicId &&
            appointment.date === booked.date &&
            appointment.time === booked.time
          )
      )
    );
  };

  const handleResetFilters = () => {
    if (formResetRef.current) {
      formResetRef.current();
    }
    setAppointments([]);
    setShowList(false);
    setIsLoading(false);
    console.log('Filters reset');
  };

  const handleSearch = async (data: AvailableSlotsSearchFormValues) => {
    console.log('Search submitted:', data);
    setIsLoading(true);
    setShowList(true);
    const startTime = Date.now();

    try {
      const request: {
        veterinarianSpecialty: string;
        date?: string;
        time?: string;
        clinicId?: string;
      } = {
        veterinarianSpecialty: data.specialty,
      };

      if (data.date && data.date.trim() !== '') {
        request.date = data.date.trim();
      }

      if (data.time && data.time.trim() !== '') {
        request.time = data.time.trim();
      }

      if (data.location && data.location.trim() !== '') {
        request.clinicId = data.location.trim();
      }

      // Prefer cached data for identical request args; RTK Query will
      // refetch once the cached data expires based on keepUnusedDataFor.
      const result = await triggerGetAvailableSlots(request, true).unwrap();

      // Map API response to appointment list format
      const mappedAppointments = result.slots.map((slot) => {
        const maybeSlot = slot as typeof slot & {
          clinicLocation?: string;
          location?: string;
          locationAddress?: string;
          locationId?: string;
          clinicLocationId?: string;
        };

        const clinicAddress =
          slot.clinicAddress ||
          maybeSlot.locationAddress ||
          maybeSlot.clinicLocation ||
          maybeSlot.location ||
          '';

        const clinicId =
          slot.clinicId ||
          maybeSlot.locationId ||
          maybeSlot.clinicLocationId ||
          resolveClinicIdByAddress(clinicAddress);

        return {
          veterinarianSpecialty: slot.veterinarianSpecialty,
          veterinarianName: slot.veterinarianName,
          veterinarianId: slot.veterinarianId,
          date: slot.date,
          time: slot.time,
          clinicAddress,
          clinicId,
        };
      });

      setAppointments(mappedAppointments);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      setAppointments([]);
    } finally {
      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_LOADING_TIME_MS) {
        await new Promise((resolve) =>
          setTimeout(resolve, MIN_LOADING_TIME_MS - elapsed)
        );
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-4 gap-6">
      <div
        className="w-full flex flex-col gap-6 rounded-[32px] p-12 bg-green-400 shadow-md"
        style={{ overflow: 'visible' }}
      >
        {/* Heading */}
        <h2 className="text-h2 text-neutral-0">Book an appointment</h2>
        <p className="text-body-m-regular text-neutral-0">
          Fill in the details below to find and book the best appointment for
          your pet.
        </p>

        {/* Form */}
        <AvailableSlotsSearch
          onSearch={handleSearch}
          onResetRef={(resetFn) => {
            formResetRef.current = resetFn;
          }}
        />

        {/* Available Appointments Section */}
        <AppointmentList
          appointments={appointments}
          show={showList}
          isLoading={isLoading}
          onResetFilters={handleResetFilters}
          onBooked={handleBookedSlot}
        />
      </div>
    </div>
  );
};
