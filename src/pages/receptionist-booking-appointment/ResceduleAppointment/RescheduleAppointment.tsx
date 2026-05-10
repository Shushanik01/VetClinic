import { useState } from 'react';

import 'react-datepicker/dist/react-datepicker.css';

import gStyles from '../globalAppointment.module.css';
import styles from './RescheduleAppointment.module.css';

import calendar from '~/assets/svg/Calendar.svg';

import Calendar from '~/components/DateAndTime/Calendar/Calendar';
import DatePicker from '~/components/DateAndTime/DatePicker/DatePicker';
import type { RescheduleAppointmentProps } from '~/components/DateAndTime/Types';
import {
  useGetVetAvailableSlotsQuery,
  useGetVetAvailableDatesQuery,
} from '~/store/api/appointments/appointment-api';
import TimeDropdown from './TimeDropdown';

const RescheduleAppointment = ({
  onClose,
  selectedDate,
  veterinarianId,
  onReschedule,
}: RescheduleAppointmentProps) => {
  const originalDate = selectedDate?.split('T')[0] ?? '';
  const originalTime = selectedDate?.split('T')[1]?.slice(0, 5) ?? '';

  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const formattedDate = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    : '';

  const { data: availableDatesData } = useGetVetAvailableDatesQuery(
    veterinarianId ?? '',
    { skip: !veterinarianId }
  );

  const { data: slotsData, isLoading: slotsLoading } =
    useGetVetAvailableSlotsQuery(
      { veterinarianId: veterinarianId ?? '', date: formattedDate },
      { skip: !veterinarianId || !formattedDate }
    );

  const availableTimes = slotsData?.slots ?? [];

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!formattedDate || !time) return;
    await onReschedule(formattedDate, time);
    onClose();
  };

  return (
    <>
      <p className={styles.reschedulePrompt}>
        <b>Scheduled appointment&apos;s date and time: </b>
        <span>
          {' '}
          {originalDate} at {originalTime || 'not specified'}{' '}
        </span>
      </p>
      <p className={styles.reschedulePrompt}>
        To reschedule the appointment provide the new data below:{' '}
      </p>
      <form onSubmit={handleSubmit}>
        <div className={styles.dateTimeWrapper}>
          <div className={gStyles.formGroup}>
            <label htmlFor="date">Date </label>
            <div className={styles.inputWrapper}>
              <DatePicker placeholder="YYYY-MM-DD" value={formattedDate}>
                <Calendar
                  selectedDate={date}
                  onDateSelect={(d) => {
                    setDate(d);
                    setTime(null);
                  }}
                  minDate={new Date()}
                  availableDates={availableDatesData?.dates ?? []}
                />
              </DatePicker>
              <img
                className={styles.icon}
                src={calendar}
                alt="calendar"
                width="16"
                height="16"
              />
            </div>
          </div>

          <div className={gStyles.formGroup}>
            <label htmlFor="time">Time</label>
            <TimeDropdown
              slots={availableTimes}
              value={time}
              onChange={setTime}
              disabled={!formattedDate || slotsLoading}
              placeholder={
                !formattedDate
                  ? 'Select a date first'
                  : slotsLoading
                    ? 'Loading...'
                    : 'Select a time'
              }
            />
          </div>
        </div>

        <div className={gStyles.buttons}>
          <button type="button" className="btn-white-l" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-regular-l" disabled={!time}>
            Reschedule Appointment
          </button>
        </div>
      </form>
    </>
  );
};

export default RescheduleAppointment;
