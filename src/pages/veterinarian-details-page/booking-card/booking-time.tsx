import React from 'react';
import { useGetVeterinarianAvailableSlotsQuery } from '~/store/api/vets/vets-api';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CalendarInput } from '~/components/forms/date-input';
import {
  parseDateValue,
  validateDateInputValue,
} from '~/components/forms/date-input/components/utils';
import { RadioInput } from '~/components/forms/radio-input';
import { LoginRequiredPopup } from '~/components/pop-up-window/login-required-popup';
import { BookAppointmentPopup } from '~/components/book-appointment-form/book-appointment-popup';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';
import type { RootState } from '~/store/store';

interface BookingTimeProps {
  veterinarianId: string;
  veterinarianName: string;
  veterinarianSpecialty: string;
  clinicAddress: string;
  clinicId: string;
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date | null) => void;
  onTimeSelect: (time: string) => void;
  showCalendar?: boolean;
  showSlots?: boolean;
}

const toApiDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeSlotTime = (value: string): string => {
  const parsed = value.match(/^(\d{2}:\d{2})/);
  return parsed ? parsed[1] : value;
};

const MIN_DATE_SWITCH_LOADING_MS = 500;

const BookingTime: React.FC<BookingTimeProps> = ({
  veterinarianId,
  veterinarianName,
  veterinarianSpecialty,
  clinicAddress,
  clinicId,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  showCalendar = true,
  showSlots = true,
}) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [showLoginPopup, setShowLoginPopup] = React.useState(false);
  const [showBookingPopup, setShowBookingPopup] = React.useState(false);
  const [bookedSlotKeys, setBookedSlotKeys] = React.useState<string[]>([]);
  const dateSwitchStartedAtRef = React.useRef(0);
  const dateSwitchTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const [dateInputValue, setDateInputValue] = React.useState('');

  const selectedDateString = selectedDate ? toApiDate(selectedDate) : '';

  React.useEffect(() => {
    setDateInputValue(selectedDateString);
  }, [selectedDateString]);

  const { data, currentData, isFetching, refetch } =
    useGetVeterinarianAvailableSlotsQuery(
      {
        veterinarianId,
        date: selectedDateString,
      },
      {
        skip: !selectedDate || !showSlots,
      }
    );

  const [isDateSwitchLoading, setIsDateSwitchLoading] = React.useState(false);

  React.useEffect(() => {
    if (!selectedDateString) {
      if (dateSwitchTimerRef.current) {
        clearTimeout(dateSwitchTimerRef.current);
        dateSwitchTimerRef.current = null;
      }
      setIsDateSwitchLoading(false);
      return;
    }

    if (dateSwitchTimerRef.current) {
      clearTimeout(dateSwitchTimerRef.current);
      dateSwitchTimerRef.current = null;
    }

    dateSwitchStartedAtRef.current = Date.now();
    setIsDateSwitchLoading(true);
  }, [selectedDateString]);

  React.useEffect(() => {
    if (!selectedDateString) {
      return;
    }

    if (!isFetching && currentData) {
      const elapsed = Date.now() - dateSwitchStartedAtRef.current;
      const remaining = Math.max(0, MIN_DATE_SWITCH_LOADING_MS - elapsed);

      if (remaining === 0) {
        setIsDateSwitchLoading(false);
        return;
      }

      dateSwitchTimerRef.current = setTimeout(() => {
        setIsDateSwitchLoading(false);
        dateSwitchTimerRef.current = null;
      }, remaining);
    }

    return () => {
      if (dateSwitchTimerRef.current) {
        clearTimeout(dateSwitchTimerRef.current);
        dateSwitchTimerRef.current = null;
      }
    };
  }, [selectedDateString, isFetching, currentData]);

  const slots = currentData?.slots ?? data?.slots ?? [];
  const visibleSlots = slots.filter(
    (slot) =>
      !bookedSlotKeys.includes(
        `${selectedDateString}|${normalizeSlotTime(slot)}`
      )
  );
  const showSlotsLoading =
    Boolean(selectedDate) && (isFetching || isDateSwitchLoading);
  const slotOptions = visibleSlots.map((slot) => ({
    label: slot,
    value: slot,
  }));

  React.useEffect(() => {
    if (
      selectedTime &&
      !visibleSlots.some(
        (slot) => normalizeSlotTime(slot) === normalizeSlotTime(selectedTime)
      )
    ) {
      onTimeSelect('');
    }
  }, [selectedTime, visibleSlots, onTimeSelect]);

  const handleDateChange = (value: string) => {
    setDateInputValue(value);

    if (!value) {
      onDateSelect(null);
      onTimeSelect('');
      return;
    }

    const validationError = validateDateInputValue(value, {
      selectionMode: 'single',
      allowPastDates: false,
      allowFutureDates: true,
    });

    if (validationError) {
      onDateSelect(null);
      onTimeSelect('');
      return;
    }

    const parsed = parseDateValue(value);

    if (!parsed) {
      onDateSelect(null);
      onTimeSelect('');
      return;
    }

    onDateSelect(parsed);
  };

  const handleBookClick = () => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    setShowBookingPopup(true);
  };

  const selectedDateLabel = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div
      className={`w-full ${
        showCalendar && showSlots
          ? 'flex flex-col min-[1200px]:flex-row items-start gap-4'
          : 'flex flex-col gap-4'
      }`}
    >
      {/* Calendar */}
      {showCalendar && (
        <div className="w-full min-[1200px]:w-[340px] shrink-0">
          <CalendarInput
            label={null}
            value={dateInputValue}
            onChange={handleDateChange}
            allowPastDates={false}
            allowFutureDates
            clearable
            inline
          />
        </div>
      )}

      {/* Time slots */}
      {showSlots && (
        <div className="w-full flex-1 border border-green-400 rounded-xl p-4 max-h-[550px] flex flex-col">
          <div className="text-body-m-bold text-black-900 mb-1">
            {selectedDate
              ? `Available time slots for ${selectedDateLabel}`
              : 'Available time slots'}
          </div>
          <div className="text-body-s-regular text-black-700 mb-4">
            Select a time slot to book your appointment
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            {!selectedDate && (
              <p className="text-body-m-regular text-black-900">
                Select a date to view available slots.
              </p>
            )}

            {showSlotsLoading && (
              <p className="text-body-m-regular text-black-900">
                Loading available slots...
              </p>
            )}

            {selectedDate && !showSlotsLoading && visibleSlots.length === 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-body-m-regular text-black-900">
                  No available slots for this date.
                </p>
                <Link
                  to={ROUTES_PATH.BOOK_APPOINTMENT}
                  className="btn-white-l w-full text-center cursor-pointer hover:bg-neutral-100 transition-colors"
                >
                  Search other appointments
                </Link>
              </div>
            )}

            {!showSlotsLoading && visibleSlots.length > 0 && (
              <RadioInput
                name="timeSlot"
                options={slotOptions}
                value={selectedTime ?? ''}
                onChange={(value) => onTimeSelect(value)}
                allowDeselect
                verticalGapClassName="gap-[20px]"
              />
            )}
          </div>

          <button
            className="btn-regular-l w-full mt-4 cursor-pointer hover:brightness-95 transition-all"
            type="button"
            disabled={!selectedDate || !selectedTime}
            onClick={handleBookClick}
          >
            Book Appointment
          </button>

          {showLoginPopup && (
            <LoginRequiredPopup onClose={() => setShowLoginPopup(false)} />
          )}

          {showBookingPopup && selectedTime && selectedDateString && (
            <BookAppointmentPopup
              veterinarianName={veterinarianName}
              veterinarianSpecialty={veterinarianSpecialty}
              date={selectedDateString}
              time={selectedTime}
              clinicAddress={clinicAddress}
              veterinarianId={veterinarianId}
              clinicId={clinicId}
              onBooked={(booked) => {
                if (booked.veterinarianId !== veterinarianId) {
                  return;
                }

                setBookedSlotKeys((prev) => [
                  ...prev,
                  `${booked.date}|${normalizeSlotTime(booked.time)}`,
                ]);
                onTimeSelect('');
                setShowBookingPopup(false);
                void refetch();
              }}
              onClose={() => setShowBookingPopup(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default BookingTime;
