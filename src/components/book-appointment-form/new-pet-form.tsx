import { Controller, type Control } from 'react-hook-form';
import { FormField } from '~/components/forms/form-field';
import { SelectInput } from '~/components/forms/select-input/select-input';
import { TextInput } from '~/components/forms/text-input';
import { TextAreaInput } from '~/components/forms/text-area-input';
import { CalendarInput } from '~/components/forms/date-input/date-input';
import type { PetFormValues } from '~/pages/my-account-page/user-account/pets/pet-form/pet-form-fields';

const SPECIES_OPTIONS = [
  { label: 'Dog', value: 'dog' },
  { label: 'Cat', value: 'cat' },
  { label: 'Other', value: 'other' },
];

type BookAppointmentFormValues = {
  petType: 'registered' | 'new';
  petId: string;
  visitReason: string;
  newPet: PetFormValues;
};

export type NewPetFormProps = {
  control: Control<BookAppointmentFormValues>;
  nameError?: string;
  speciesError?: string;
  dateOfBirthError?: string;
  visitReasonError?: string;
  validateVisitReason: (value: string) => true | string;
  validateName: (value: string) => true | string;
  validateSpecies: (value: string) => true | string;
  validateDateOfBirth: (value: string) => true | string;
};

export const NewPetForm = ({
  control,
  nameError,
  speciesError,
  dateOfBirthError,
  visitReasonError,
  validateVisitReason,
  validateName,
  validateSpecies,
  validateDateOfBirth,
}: NewPetFormProps) => {
  return (
    <div className="flex flex-col gap-[16px]">
      <FormField label="Pet name" required error={nameError}>
        <Controller
          name="newPet.name"
          control={control}
          rules={{ validate: validateName }}
          render={({ field }) => (
            <TextInput
              id="newPetName"
              value={field.value}
              onChange={field.onChange}
              placeholder="Enter Pet's Name"
              maxLength={80}
            />
          )}
        />
      </FormField>

      <FormField label="Species" required error={speciesError}>
        <Controller
          name="newPet.species"
          control={control}
          rules={{ validate: validateSpecies }}
          render={({ field }) => (
            <SelectInput
              id="newPetSpecies"
              value={field.value}
              onChange={field.onChange}
              options={SPECIES_OPTIONS}
              placeholder="Select species"
            />
          )}
        />
      </FormField>

      <Controller
        name="newPet.dateOfBirth"
        control={control}
        rules={{ validate: validateDateOfBirth }}
        render={({ field }) => (
          <CalendarInput
            id="newPetDateOfBirth"
            value={field.value}
            onChange={field.onChange}
            required
            allowPastDates
            allowFutureDates={false}
            clearable
            shouldValidate={true}
            label="Date of birth"
            error={dateOfBirthError}
          />
        )}
      />

      <FormField label="Reason for visit" required error={visitReasonError}>
        <Controller
          name="visitReason"
          control={control}
          rules={{ validate: validateVisitReason }}
          render={({ field }) => (
            <TextAreaInput
              id="newPetVisitReason"
              rows={4}
              placeholder="Tell us why you're visiting..."
              value={field.value}
              onChange={field.onChange}
              className="h-[72px]"
            />
          )}
        />
      </FormField>
    </div>
  );
};
