import { useState, useEffect } from 'react';

import styles from './Appointment.module.css';
import gStyles from '../globalAppointment.module.css';

import calendar from '~/assets/svg/Calendar.svg';
import clock from '~/assets/svg/Clock.svg';

import Time from '~/components/DateAndTime/Time/Time';
import DatePicker from '~/components/DateAndTime/DatePicker/DatePicker';
import Calendar from '~/components/DateAndTime/Calendar/Calendar';
import SelectOption from '~/components/SelectOption/SelectOption';
import { specialtyConfig } from '../mockData';
import type { AppointmentSlot } from '~/store/api/appointments/appointment-types';

type Clinic = { clinicId: string; clinicLocation: string };

const API_URL =
  (import.meta.env.VITE_API_URL as string) ||
  (window as any).__APP_CONFIG__?.API_URL ||
  '';

export default function AppointmentDetails({
  onValidChange,
}: {
  onValidChange?: (valid: boolean) => void;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedVetId, setSelectedVetId] = useState<string>('');
  const [selectedClinicId, setSelectedClinicId] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);

  // onValidChange is in deps so validity re-emits when this step becomes active again
  useEffect(() => {
    onValidChange?.(
      !!selectedSpecialty && !!selectedDate && !!selectedTime && !!selectedVetId
    );
  }, [
    selectedSpecialty,
    selectedDate,
    selectedTime,
    selectedVetId,
    onValidChange,
  ]);

  const dateString = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    : '';

  useEffect(() => {
    if (!selectedSpecialty) return;
    setSelectedVetId('');
    setSelectedClinicId('');
    setSelectedLocation('');
    setSelectedDate(null);
    setSelectedTime(null);
    setAvailableSlots([]);
    setClinics([]);

    fetch(`${API_URL}/appointments/available-slots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ veterinarianSpecialty: selectedSpecialty }),
    })
      .then((r) => r.json())
      .then((res) => setAvailableSlots(res?.slots ?? []))
      .catch(() => setAvailableSlots([]));

    fetch(
      `${API_URL}/clinics?specialty=${encodeURIComponent(selectedSpecialty)}`
    )
      .then((r) => r.json())
      .then((res) => setClinics(Array.isArray(res) ? res : []))
      .catch(() => setClinics([]));
  }, [selectedSpecialty]);

  // Slots filtered by selected clinic (or all if none selected)
  const filteredSlots = selectedClinicId
    ? availableSlots.filter((s) => s.clinicId === selectedClinicId)
    : availableSlots;

  // Available dates based on filtered slots
  const availableDatesForSpecialty = [
    ...new Set(filteredSlots.map((s) => s.date)),
  ];

  // Available times for the selected date (before vet is chosen)
  const availableTimesForDate = dateString
    ? [
        ...new Set(
          filteredSlots.filter((s) => s.date === dateString).map((s) => s.time)
        ),
      ]
    : [];

  // Unique vets available for the selected date + time
  const slotsForDateAndTime =
    dateString && selectedTime
      ? filteredSlots.filter(
          (s) => s.date === dateString && s.time === selectedTime
        )
      : filteredSlots;
  const uniqueVets = [
    ...new Map(
      slotsForDateAndTime.map((slot) => [slot.veterinarianId, slot])
    ).values(),
  ];

  const handleLocationSelect = (locationName: string) => {
    const clinic = clinics.find((c) => c.clinicLocation === locationName);
    if (clinic) {
      setSelectedClinicId(clinic.clinicId);
      setSelectedLocation(clinic.clinicLocation);
      setSelectedVetId('');
    }
  };

  const handleVetSelect = (vetName: string) => {
    const vet = uniqueVets.find((v) => v.veterinarianName === vetName);
    if (vet) {
      setSelectedVetId(vet.veterinarianId);
      // If no clinic explicitly selected, derive it from the vet's slot
      if (!selectedClinicId) {
        setSelectedClinicId(vet.clinicId);
        setSelectedLocation(vet.clinicAddress);
      }
    }
  };

  return (
    <section className={gStyles.section}>
      <input type="hidden" name="veterinarianId" value={selectedVetId} />
      <input type="hidden" name="location" value={selectedLocation} />
      <input type="hidden" name="clinicId" value={selectedClinicId} />

      <div className={gStyles.formGroup}>
        <label>Veterinarian Specialty</label>
        <SelectOption
          {...specialtyConfig}
          placeholder={specialtyConfig.name}
          onChange={setSelectedSpecialty}
          value={selectedSpecialty}
        />
      </div>

      <div className={styles.dateTimeWrapper}>
        <div className={gStyles.formGroup}>
          <label htmlFor="date">Date</label>
          <div className={styles.inputWrapper}>
            <DatePicker placeholder="YYYY-MM-DD" name="date" value={dateString}>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                  setSelectedVetId('');
                }}
                availableDates={availableDatesForSpecialty}
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
          <div className={styles.inputWrapper}>
            <DatePicker
              placeholder="HH:MM"
              name="time"
              value={selectedTime ?? ''}
            >
              <Time
                selectedTime={selectedTime}
                onTimeSelect={(t) => {
                  setSelectedTime(t);
                  setSelectedVetId('');
                }}
                availableSlots={
                  availableTimesForDate.length > 0
                    ? availableTimesForDate
                    : undefined
                }
              />
            </DatePicker>
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

      <div className={gStyles.formGroup}>
        <label>Location</label>
        <SelectOption
          key={`location-${selectedSpecialty}`}
          name="locationSelect"
          options={clinics.map((c) => c.clinicLocation)}
          placeholder="Select Location"
          onChange={handleLocationSelect}
        />
      </div>

      <div className={gStyles.formGroup}>
        <label>Veterinarian Name</label>
        <SelectOption
          key={`vet-${selectedSpecialty}-${selectedClinicId}`}
          name="vetName"
          options={uniqueVets.map((v) => v.veterinarianName)}
          placeholder="Select Veterinarian"
          onChange={handleVetSelect}
        />
      </div>
    </section>
  );
}
