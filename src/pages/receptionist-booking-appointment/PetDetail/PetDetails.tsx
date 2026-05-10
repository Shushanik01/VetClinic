import { useState, useEffect } from 'react';
import RadioButtons from '../RadioButtons/RadioButtons';

import gStyles from '../globalAppointment.module.css';
import aStyles from '../Create-appointment/Appointment.module.css';
import SelectOption from '~/components/SelectOption/SelectOption';
import type { OptionItem } from '~/components/DateAndTime/Types';
import DatePicker from '~/components/DateAndTime/DatePicker/DatePicker';
import Calendar from '~/components/DateAndTime/Calendar/Calendar';
import calendar from '~/assets/svg/Calendar.svg';

type PetOption = { petId: string; name: string };

const PetDetails = ({
  onValidChange,
  clientPets = [],
}: {
  onValidChange?: (valid: boolean) => void;
  clientPets?: PetOption[];
}) => {
  const [formType, setFormType] = useState('first');
  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedPetName, setSelectedPetName] = useState('');
  const [visitReason, setVisitReason] = useState('');
  const [petSpecies, setPetSpecies] = useState('');
  const [newPetName, setNewPetName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [generatedPetId] = useState(
    () => `pet-${crypto.randomUUID().slice(0, 8)}`
  );

  const today = new Date();

  const dateOfBirthString = dateOfBirth
    ? `${dateOfBirth.getFullYear()}-${String(dateOfBirth.getMonth() + 1).padStart(2, '0')}-${String(dateOfBirth.getDate()).padStart(2, '0')}`
    : '';

  useEffect(() => {
    const valid =
      formType === 'first'
        ? !!selectedPetId && !!visitReason
        : !!petSpecies && !!newPetName && !!dateOfBirth && !!visitReason;
    onValidChange?.(valid);
  }, [
    formType,
    selectedPetId,
    visitReason,
    petSpecies,
    newPetName,
    dateOfBirth,
    onValidChange,
  ]);

  const petOptions: OptionItem[] = clientPets.map((p) => ({
    label: p.name,
    value: p.petId,
  }));

  const handlePetSelect = (petId: string) => {
    setSelectedPetId(petId);
    const pet = clientPets.find((p) => p.petId === petId);
    setSelectedPetName(pet?.name ?? '');
  };

  return (
    <section className={gStyles.section}>
      <RadioButtons
        heading="Pet details"
        setFormType={setFormType}
        firstButtonLabel="Registered pet"
        secondButtonLabel="New pet"
      />
      <div className={`${gStyles.formGroup} ${gStyles[formType]}`}>
        {formType === 'first' ? (
          <>
            <input type="hidden" name="name" value={selectedPetName} />
            <label>Pet name</label>
            <SelectOption
              key={clientPets.map((p) => p.petId).join(',')}
              name="petId"
              options={petOptions}
              placeholder="Select a pet"
              onChange={handlePetSelect}
            />
            <label htmlFor="visitReason">Visit reason</label>
            <textarea
              id="visitReason"
              name="visitReason"
              placeholder="Enter visit reason"
              value={visitReason}
              onChange={(e) => setVisitReason(e.target.value)}
            />
          </>
        ) : (
          <>
            <input type="hidden" name="petId" value={generatedPetId} />
            <label>Species</label>
            <SelectOption
              name="petSpecies"
              options={[
                { label: 'Dog', value: 'dog' },
                { label: 'Cat', value: 'cat' },
                { label: 'Bird', value: 'bird' },
                { label: 'Other', value: 'other' },
              ]}
              placeholder="Select a species"
              onChange={setPetSpecies}
            />
            <label htmlFor="newPetName">Pet name</label>
            <input
              id="newPetName"
              name="newPetName"
              type="text"
              placeholder="Enter pet name"
              value={newPetName}
              onChange={(e) => setNewPetName(e.target.value)}
            />
            <label htmlFor="dateOfBirth">Date of birth</label>
            <div className={aStyles.inputWrapper}>
              <DatePicker
                placeholder="YYYY-MM-DD"
                name="dateOfBirth"
                value={dateOfBirthString}
              >
                <Calendar
                  selectedDate={dateOfBirth}
                  onDateSelect={setDateOfBirth}
                  maxDate={today}
                />
              </DatePicker>
              <img
                className={aStyles.icon}
                src={calendar}
                alt="calendar"
                width="16"
                height="16"
              />
            </div>
            <label htmlFor="visitReason">Visit reason</label>
            <textarea
              id="visitReason"
              name="visitReason"
              placeholder="Enter visit reason"
              value={visitReason}
              onChange={(e) => setVisitReason(e.target.value)}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default PetDetails;
