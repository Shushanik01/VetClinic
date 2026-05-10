import { useState } from 'react';

import styles from './Appointment.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import calendar from '~/assets/svg/calendar-regular-full.svg';
import clock from '~/assets/svg/clock-regular-full.svg';

export default function AppointmentDetails() {
  // const [appointment, setAppointment] = useState(null);
  const [date] = useState(null);
  const [time] = useState(null);

  // const formattedTime = time?.toLocaleTimeString("en-GB", {
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   hour12: false,
  // });

  return (
    <>
      <div className={styles.formGroup}>
        <label htmlFor="specialty">Veterinarian Specialty</label>
        <select id="specialty" required>
          <option value="">Select specialty</option>
          <option value="general">General</option>
          <option value="surgery">Surgery</option>
          <option value="dentistry">Dentistry</option>
          <option value="dermatology">Dermatology</option>
        </select>
      </div>

      <div className={styles.dateTimeWrapper}>
        <div className={styles.formGroup}>
          <label htmlFor="date">Date </label>
          <div className={styles.inputWrapper}>
            <DatePicker
              id="date"
              selected={date}
              // onChange={(selectedDate) => setDate(selectedDate)}
              dateFormat="yyyy-MM-dd"
              placeholderText="YYYY-MM-DD"
              className={styles.input}
            />
            <img
              className={styles.icon}
              src={calendar}
              alt="calendar"
              width="16"
              height="16"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="time">Time </label>
          <div className={styles.inputWrapper}>
            <DatePicker
              id="time"
              selected={time}
              // onChange={(selectedTime) => setTime(selectedTime)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeFormat="HH:mm"
              dateFormat="HH:mm"
              placeholderText="HH:MM"
              className={styles.input}
            />
            <img
              className={styles.icon}
              src={clock}
              alt="clock"
              width="16"
              height="16"
            />
          </div>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="location">Location </label>
        <input type="text" id="location" required />
      </div>
      <div className={styles.profileWrapper}>
        <div className={styles.formGroup}>
          <label htmlFor="vet-name">Veterinarian Name </label>
          <input type="text" id="vet-name" placeholder="Select Name" required />
        </div>
        <p className={styles.profile}>view profile</p>
      </div>
    </>
  );
}
