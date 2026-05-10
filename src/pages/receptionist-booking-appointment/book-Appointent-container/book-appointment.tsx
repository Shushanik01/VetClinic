import React, { Fragment, useState, useEffect } from 'react';
import styles from './book-appointment.module.css';
import Table from '../table/table';
import type { Data } from '../table/table';
import PopUp from '../popUp/Popup';
import {
  useGetShceduledAppointmentsQuery,
  useCancelAppointmentMutation,
  useRescheduleAppointmentMutation,
} from '~/store/api/appointments/appointment-api';
import { notify } from '~/app/providers/notifications/notifications';

const ReceptionBooking: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [rescheduleId, setRescheduleId] = useState<number | null>(null);
  const [componentType, setComponentType] = useState< 'Create' | 'Reschedule' | 'Cancel'>('Create');
  const [data, setData] = useState<Data[]>([]);
  const [filteredCount, setFilteredCount] = useState<number>(0);
  const [filteredAddress, setFilteredAddress] = useState<string | null>(null);
  const [tableActiveDate, setTableActiveDate] = useState<string | undefined>(undefined);
  const { data: appointmentsData } = useGetShceduledAppointmentsQuery();
  const [cancelAppointment] = useCancelAppointmentMutation();
  const [rescheduleAppointment] = useRescheduleAppointmentMutation();

  useEffect(() => {
    if (appointmentsData?.appointments) {
      const tableData: Data[] = appointmentsData.appointments.map(
        (appt, index) => ({
          id: index,
          appointmentId: appt.appointmentId,
          veterinarianId: appt.veterinarianId,
          clientName:
            `${appt.clientFirstName ?? ''} ${appt.clientLastName ?? ''}`.trim(),
          petName: appt.petName ?? '',
          petAge: (() => {
            if (!appt.petBirthDate) return '';
            const birth = new Date(appt.petBirthDate);
            const years = new Date().getFullYear() - birth.getFullYear();
            return years === 1 ? '1 year' : `${years} years`;
          })(),
          vetName: appt.veterinarianName ?? '',
          address: appt.location,
          specialty: appt.veterinarianSpecialty ?? '',
          date: appt.dateTimeStart,
          status: (appt.status as string) === 'Service Provided' ? 'Service provided' : appt.status,
        })
      );
      setData(tableData);
    }
  }, [appointmentsData]);

  const handleCancelConfirm = async () => {
    const appointment = data.find((a) => a.id === cancelId);
    if (!appointment) return;
    const result = await cancelAppointment(appointment.appointmentId);
    if ('error' in result) {
      notify({
        title: 'Cancellation failed',
        description: 'Could not cancel the appointment. Please try again.',
        type: 'error',
      });
      return;
    }
    notify({
      title: 'Appointment cancelled',
      description: 'The appointment has been successfully cancelled.',
      type: 'success',
    });
    setData((prev) =>
      prev.map((a) => (a.id === cancelId ? { ...a, status: 'Canceled' } : a))
    );
    setCancelId(null);
  };

  const handleCreateAppointment = (appointment: Data) => {
    setData((prev) => [...prev, appointment]);
  };

  const handleRescheduleConfirm = async (date: string, time: string) => {
    const appointment = data.find((a) => a.id === rescheduleId);
    if (!appointment) return;
    const newDateTime = `${date}T${time}:00Z`;
    const result = await rescheduleAppointment({
      appointmentId: appointment.appointmentId,
      newDateTime,
    });
    if ('error' in result) {
      notify({
        title: 'Reschedule failed',
        description: 'Could not reschedule the appointment. Please try again.',
        type: 'error',
      });
      return;
    }
    notify({
      title: 'Appointment rescheduled',
      description: result.data.message,
      type: 'success',
    });
    setData((prev) =>
      prev.map((a) => (a.id === rescheduleId ? { ...a, date: newDateTime } : a))
    );
    setTableActiveDate(date);
    setRescheduleId(null);
  };

  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.left_side}>
            <h2 className={`${styles.title}`}>Appointments</h2>
            <p className={styles.text}>
              {filteredCount} booked appointments
              {filteredAddress ? ` for ${filteredAddress}` : ''}
            </p>
          </div>
          <div className={styles.right_side}>
            <button
              className="btn-regular-l"
              onClick={() => {
                setComponentType('Create');
                setIsPopupOpen(true);
              }}
            >
              Create an Appointment
            </button>
          </div>
        </div>
        <Table
          data={data}
          onDeleteClick={(id) => {
            setCancelId(id);
            setIsPopupOpen(true);
          }}
          onEditClick={(id) => {
            setRescheduleId(id);
            setIsPopupOpen(true);
          }}
          setComponentType={setComponentType}
          onFilteredCountChange={setFilteredCount}
          onFilteredAddressChange={setFilteredAddress}
          activeDate={tableActiveDate}
        />
      </div>
      {isPopupOpen && (
        <PopUp
          onClose={() => setIsPopupOpen(false)}
          onConfirm={() => {
            handleCancelConfirm();
            setIsPopupOpen(false);
          }}
          componentType={componentType}
          onReschedule={(date, time) => {
            handleRescheduleConfirm(date, time);
            setIsPopupOpen(false);
          }}
          appointmentDate={data.find((d) => d.id === rescheduleId)?.date}
          veterinarianId={data.find((d) => d.id === rescheduleId)?.veterinarianId}
          veterinarianSpecialty={data.find((d) => d.id === rescheduleId)?.specialty}
          onCreateAppointment={handleCreateAppointment}
        />
      )}
    </Fragment>
  );
};
export default ReceptionBooking;
