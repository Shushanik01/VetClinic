import styles from './popup.module.css';

import { appointmentTitles } from '../mockData';
import CancelAppointment from '../CancelAppointment/CancelAppointmant';
import RescheduleAppointment from '../ResceduleAppointment/RescheduleAppointment';
import type { Data } from '../table/table';
import { CreateAppointmentFlow } from './create-appointment-flow';

type PopUpProps = Readonly<{
  onClose: () => void;
  onConfirm?: () => void;
  componentType: string;
  onReschedule?: (date: string, time: string) => void;
  appointmentDate?: string;
  veterinarianId?: string;
  veterinarianSpecialty?: string;
  onCreateAppointment?: (appointment: Data) => void;
}>;

function PopUp({
  onClose,
  onConfirm,
  componentType,
  onReschedule,
  appointmentDate,
  veterinarianId,
  onCreateAppointment,
}: PopUpProps) {
  const [createTypeKey, cancelTypeKey, rescheduleTypeKey] =
    Object.keys(appointmentTitles);

  return (
    <div className={styles.overlay}>
      <button
        type="button"
        aria-label="Close popup"
        className={styles.overlayCloseButton}
        onClick={onClose}
      ></button>

      <div className={styles.popupContainer}>
        <div className={styles.popup}>
          <h2>{appointmentTitles[componentType]}</h2>

          {componentType === createTypeKey && (
            <CreateAppointmentFlow
              onClose={onClose}
              onCreateAppointment={onCreateAppointment}
            />
          )}

          {componentType === cancelTypeKey && (
            <CancelAppointment
              onClose={onClose}
              onConfirm={onConfirm ?? onClose}
            />
          )}

          {componentType === rescheduleTypeKey && (
            <RescheduleAppointment
              onClose={onClose}
              selectedDate={appointmentDate}
              veterinarianId={veterinarianId}
              onReschedule={onReschedule ?? (() => {})}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PopUp;
