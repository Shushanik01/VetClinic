import React from 'react';

import styles from './Time.module.css';
import type { BookingTimeProps } from '../Types';

const Time: React.FC<BookingTimeProps> = ({
  selectedTime,
  onTimeSelect,
  availableSlots,
}) => {
  const timeSlots = availableSlots
    ? availableSlots.map((s) => ({ label: s }))
    : Array.from({ length: 12 }, (_, h) => h + 1).flatMap((hour) =>
        Array.from({ length: 4 }, (_, m) => ({
          label: `${String(hour).padStart(2, '0')}:${String(m * 15).padStart(2, '0')}`,
        }))
      );

  return (
    <div className={styles.container}>
      {timeSlots.map((slot) => (
        <button
          key={slot.label}
          onClick={() => onTimeSelect(slot.label)}
          className={selectedTime === slot.label ? styles.selected : ''}
        >
          {slot.label}
        </button>
      ))}
    </div>
  );
};

export default Time;
