import { useState, useRef, useEffect } from 'react';
import styles from './RescheduleAppointment.module.css';
import VectorUp from '~/assets/svg/VectorUp.svg';
import VectorDown from '~/assets/svg/VectorDown.svg';

interface TimeDropdownProps {
  slots: string[];
  value: string | null;
  onChange: (time: string) => void;
  disabled: boolean;
  placeholder: string;
}

const TimeDropdown = ({
  slots,
  value,
  onChange,
  disabled,
  placeholder,
}: TimeDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSelect = (slot: string) => {
    onChange(slot);
    setIsOpen(false);
  };

  return (
    <div
      className={`${styles.timeDropdown} ${disabled ? styles.timeDropdownDisabled : ''}`}
      ref={ref}
    >
      <div className={styles.timeDropdownHeader} onClick={handleToggle}>
        <span
          className={
            value ? styles.timeDropdownValue : styles.timeDropdownPlaceholder
          }
        >
          {value ?? placeholder}
        </span>
        <img
          src={isOpen ? VectorUp : VectorDown}
          alt={isOpen ? 'collapse' : 'expand'}
          width="12"
          height="12"
        />
      </div>

      {isOpen && (
        <div className={styles.timeDropdownList}>
          {slots.length === 0 ? (
            <div className={styles.timeDropdownEmpty}>No available slots</div>
          ) : (
            slots.map((slot) => (
              <div
                key={slot}
                className={`${styles.timeDropdownOption} ${value === slot ? styles.timeDropdownOptionSelected : ''}`}
                onClick={() => handleSelect(slot)}
              >
                {slot}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TimeDropdown;
