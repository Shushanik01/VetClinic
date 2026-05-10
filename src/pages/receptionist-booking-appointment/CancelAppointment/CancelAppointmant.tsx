import { useState, useRef, useEffect } from 'react';
import gStyles from '../globalAppointment.module.css';
import styles from './CancelAppointment.module.css';

import VectorUp from '~/assets/svg/VectorUp.svg';
import VectorDown from '~/assets/svg/VectorDown.svg';

const reasons = [
  'Scheduling conflict',
  'No longer needs appointment',
  'Veterinarian unavailable',
  'Overbooking error',
  'Other',
];

interface CancelAppointmentProps {
  onClose: () => void;
  onConfirm: () => void;
}

const CancelAppointment = ({ onClose, onConfirm }: CancelAppointmentProps) => {
  const [selected, setSelected] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <form>
      <div className={gStyles.formGroup}>
        <label>Reason</label>

        <div className={styles.customSelect} ref={dropdownRef}>
          <div
            className={styles.selectHeader}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {selected || 'Select Reason'}
            <span className={styles.arrow}>
              {isOpen ? (
                <img src={VectorUp} alt="Up Arrow" />
              ) : (
                <img src={VectorDown} alt="Down Arrow" />
              )}
            </span>
          </div>

          {isOpen && (
            <div className={styles.dropdown}>
              {reasons.map((reason) => (
                <div
                  key={reason}
                  className={styles.option}
                  onClick={() => {
                    setSelected(reason);
                    setIsOpen(false);
                  }}
                >
                  {reason}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selected === 'Other' && (
        <div className={gStyles.formGroup}>
          <label>Comments</label>
          <input placeholder="Add Comments" />
        </div>
      )}

      <div className={gStyles.buttons}>
        {/* <div> */}
        <button
          type="button"
          //  className={gStyles.cancelButton}
          className="btn-white-l"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="button"
          className="btn-regular-l"
          disabled={!selected}
          onClick={onConfirm}
        >
          Cancel Appointment
        </button>
      </div>
    </form>
  );
};

export default CancelAppointment;
