import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { DatePickerProps } from '../Types';

import styles from './DatePicker.module.css';

const DatePicker: FC<DatePickerProps> = ({
  placeholder = 'YYYY-MM-DD',
  children,
  value = '',
  name = 'data',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (value) setIsOpen(false);
  }, [value]);

  return (
    <div className={styles.datePickerWrapper}>
      <input
        type="text"
        name={name}
        readOnly
        onFocus={() => setIsOpen((prev) => !prev)}
        placeholder={placeholder}
        value={value}
        required
      />
      {isOpen && <div className={styles.calendarDropdown}>{children}</div>}
    </div>
  );
};

export default DatePicker;
