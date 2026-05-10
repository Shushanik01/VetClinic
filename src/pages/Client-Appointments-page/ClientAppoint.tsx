import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './appointment.module.css';
import date from '~/assets/svg/date.svg';
import Clock from '~/assets/svg/Time.svg';
import Adress from '~/assets/svg/adress.svg';
import doctoricon from '~/assets/svg/doctoricon.svg';
import Icon from '~/assets/svg/Icon.svg';
import comment from '~/assets/svg/comment.svg';
import { Feedback } from '../feedback/feedback';
import CancelAppointment from '../receptionist-booking-appointment/CancelAppointment/CancelAppointmant';
import RescheduleAppointment from '../receptionist-booking-appointment/ResceduleAppointment/RescheduleAppointment';
import {
  useGetShceduledAppointmentsQuery,
  useRescheduleAppointmentMutation,
  useCancelAppointmentMutation,
} from '~/store/api/appointments/appointment-api';
import { notify } from '~/app/providers/notifications/notifications';
import { ROUTES_PATH } from '~/app/providers/router';

type AppointmentDisplay = {
  id: number;
  appointmentId: string;
  veterinarianId: string;
  status: string;
  date: string;
  rawDate: string;
  time: string;
  adress: string;
  doctor: string;
  type: string;
  recommendation: string;
  feedbackId?: string;
};

export const ClientAppointments: React.FC = () => {
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackAppointmentId, setFeedbackAppointmentId] = useState<
    string | null
  >(null);
  const [feedbackId, setFeedbackId] = useState<string | undefined>(undefined);
  const [showCancel, setShowCancel] = useState<boolean>(false);
  const [showReschedule, setShowReschedule] = useState<boolean>(false);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<AppointmentDisplay[]>([]);
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState<
    string | null
  >(null);
  const [rescheduleVetId, setRescheduleVetId] = useState<string | null>(null);
  const [rescheduleVetSpecialty, setRescheduleVetSpecialty] = useState<string | null>(null);
  const [rescheduleRawDate, setRescheduleRawDate] = useState<string | null>(
    null
  );
  const [cancelAppointmentId, setCancelAppointmentId] = useState<string | null>(
    null
  );
  const {
    data: appointmentsData,
    isLoading,
    isError,
  } = useGetShceduledAppointmentsQuery();
  const [rescheduleAppointment] = useRescheduleAppointmentMutation();
  const [cancelAppointment] = useCancelAppointmentMutation();

  useEffect(() => {
    if (appointmentsData?.appointments) {
      const mapped = appointmentsData.appointments.map((appt, index) => ({
        id: index,
        appointmentId: appt.appointmentId,
        veterinarianId: appt.veterinarianId,
        status: appt.status,
        date: new Date(
          appt.dateTimeStart + (appt.dateTimeStart.endsWith('Z') ? '' : 'Z')
        ).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        }),
        rawDate: appt.dateTimeStart.split('T')[0],
        time: appt.dateTimeStart.split('T')[1].slice(0, 5),
        adress: appt.location,
        doctor: appt.veterinarianName ?? '',
        type: appt.veterinarianSpecialty ?? '',
        recommendation: appt.veterinarianRecommendations ?? '',
        feedbackId: appt.feedbackId ?? appt.feedback?.id,
      }));
      setAppointments((prev) => {
        if (prev.length === 0) return mapped;
        const byId = new Map(mapped.map((a) => [a.appointmentId, a]));
        const existingIds = new Set(prev.map((a) => a.appointmentId));
        const updated = prev
          .filter((a) => byId.has(a.appointmentId) || a.status === 'Canceled')
          .map((a) => {
            if (!byId.has(a.appointmentId)) return a;
            const fresh = byId.get(a.appointmentId)!;
            return {
              ...fresh,
              feedbackId: fresh.feedbackId ?? a.feedbackId,
              status: a.status === 'Finished' && fresh.status === 'Service provided' ? 'Finished' : fresh.status,
            };
          });

        const added = mapped.filter((a) => !existingIds.has(a.appointmentId));
        return [...updated, ...added];
      });
    }
  }, [appointmentsData]);

  const statusStyles: Record<string, string> = {
    Scheduled: styles.scheduled,
    'Service provided': styles.provided,
    Canceled: styles.cancelled,
    Finished: styles.finished,
  };

  if (isLoading) {
    return (
      <section className={styles.main}>
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>My Appointments</h2>
        </div>
        <p>Loading appointments...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={styles.main}>
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>My Appointments</h2>
        </div>
        <p>Failed to load appointments. Please try again later.</p>
      </section>
    );
  }

  return (
    <section className={styles.main}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>My Appointments</h2>
        <button
          className="btn-regular-l "
          onClick={() => navigate(ROUTES_PATH.BOOK_APPOINTMENT)}
        >
          Book Appointment
        </button>
      </div>
      <div className={styles.slotsContainer}>
        {appointments.map((data) => (
          <div key={data.appointmentId} className={styles.block}>
            <p
              className={`${styles.statusBadge} ${statusStyles[data.status] || ''}`}
            >
              {data.status}
            </p>
            <div className={styles.sidesContainer}>
              <div className={styles.side}>
                <div className={styles.infoRow}>
                  <img className={styles.infoIcon} src={date} />
                  <span>{data.date}</span>
                </div>
                <div className={styles.infoRow}>
                  <img className={styles.infoIcon} src={Clock} />
                  <span>{data.time}</span>
                </div>
                <div className={styles.infoRow}>
                  <img className={styles.infoIcon} src={Adress} />
                  <span>{data.adress}</span>
                </div>
              </div>
              <div className={styles.side}>
                <div className={styles.infoRow}>
                  <img className={styles.infoIcon} src={doctoricon} />{' '}
                  <Link
                    to={`/veterinarian/${data.veterinarianId}`}
                    className={styles.doctor_name}
                  >
                    {data.doctor}
                  </Link>{' '}
                </div>
                <div className={styles.infoRow}>
                  <img className={styles.infoIcon} src={Icon} />
                  <span>{data.type}</span>
                </div>
              </div>
            </div>
            {(data.status === 'Scheduled' && (
              <div className={styles.sheduled_btn}>
                <button
                  className="btn-white-l"
                  onClick={() => {
                    setCancelAppointmentId(data.appointmentId);
                    setShowCancel(true);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-regular-l "
                  onClick={() => {
                    setRescheduleAppointmentId(data.appointmentId);
                    setRescheduleVetId(data.veterinarianId);
                    setRescheduleVetSpecialty(data.type);
                    setRescheduleRawDate(data.rawDate);
                    setShowReschedule(true);
                  }}
                >
                  Reschedule
                </button>
              </div>
            )) ||
              (data.status === 'Service provided' && !data.feedbackId && (
                <div className="flex flex-col gap-4">
                  <div className={styles.recommendation}>
                    <img className={styles.recommendationIcon} src={comment} />
                    <span className={styles.recText}>
                      <p className={styles.recTitle}>
                        Veterinarian Recommendations
                      </p>
                      <p className={styles.recBody}>{data.recommendation}</p>
                    </span>
                  </div>
                  <button
                    className={`btn-regular-l ${styles.feedbackBtn}`}
                    onClick={() => {
                      setFeedbackAppointmentId(data.appointmentId);
                      setFeedbackId(undefined);
                      setShowFeedback(true);
                    }}
                  >
                    Leave Feedback
                  </button>
                </div>
              )) ||
              ((data.status === 'Finished' || (data.status === 'Service provided' && data.feedbackId)) && (
                <div className="flex flex-col gap-4">
                  <div className={styles.recommendation}>
                    <img className={styles.recommendationIcon} src={comment} />
                    <span className={styles.recText}>
                      <p className={styles.recTitle}>
                        Veterinarian Recommendations
                      </p>
                      <p className={styles.recBody}>{data.recommendation}</p>
                    </span>
                  </div>
                  <button
                    className={`btn-white-l ${styles.feedbackBtn}`}
                    onClick={() => {
                      setFeedbackAppointmentId(data.appointmentId);
                      setFeedbackId(data.feedbackId);
                      setShowFeedback(true);
                    }}
                  >
                    Update Feedback
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>

      {showFeedback && feedbackAppointmentId && (
        <div className={styles.overlay}>
          <Feedback
            onClose={() => setShowFeedback(false)}
            appointmentId={feedbackAppointmentId}
            feedbackId={feedbackId}
            onSuccess={(newFeedbackId) => {
              setAppointments((prev) =>
                prev.map((a) =>
                  a.appointmentId === feedbackAppointmentId
                    ? { ...a, status: 'Finished', feedbackId: newFeedbackId ?? a.feedbackId }
                    : a
                )
              );
            }}
          />
        </div>
      )}

      {showReschedule && (
        <div className={styles.overlay}>
          <div className={styles.reschedulePopup}>
            <h2 className={styles.reschedulePopupTitle}>
              Reschedule Appointment
            </h2>
            <RescheduleAppointment
              onClose={() => setShowReschedule(false)}
              veterinarianId={rescheduleVetId ?? undefined}
              veterinarianSpecialty={rescheduleVetSpecialty ?? undefined}
              selectedDate={rescheduleRawDate ?? undefined}
              onReschedule={async (date, time) => {
                if (!rescheduleAppointmentId) return;
                const newDateTime = `${date}T${time}:00Z`;
                try {
                  const data = await rescheduleAppointment({
                    appointmentId: rescheduleAppointmentId,
                    newDateTime,
                  }).unwrap();
                  notify({
                    title: 'Appointment rescheduled',
                    description: data.message,
                    type: 'success',
                  });
                  setShowReschedule(false);
                } catch {
                  notify({
                    title: 'Reschedule failed',
                    description:
                      'Could not reschedule the appointment. Please try again.',
                    type: 'error',
                  });
                }
              }}
            />
          </div>
        </div>
      )}

      {showCancel && (
        <div className={styles.overlay}>
          <div className={styles.cancelPopup}>
            <h2 className={styles.cancelPopupTitle}>Cancel Appointment</h2>
            <CancelAppointment
              onClose={() => setShowCancel(false)}
              onConfirm={async () => {
                if (!cancelAppointmentId) return;
                const result = await cancelAppointment(cancelAppointmentId);
                if ('error' in result) return;
                setAppointments((prev) =>
                  prev.map((a) =>
                    a.appointmentId === cancelAppointmentId
                      ? { ...a, status: 'Canceled' }
                      : a
                  )
                );
                setShowCancel(false);
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
};
