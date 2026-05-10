import { Controller, type Control } from 'react-hook-form';
import { FormField } from '~/components/forms/form-field';
import { SelectInput } from '~/components/forms/select-input/select-input';
import { TextAreaInput } from '~/components/forms/text-area-input';
import type { PetFormValues } from '~/pages/my-account-page/user-account/pets/pet-form/pet-form-fields';

type BookAppointmentFormValues = {
  petType: 'registered' | 'new';
  petId: string;
  visitReason: string;
  newPet: PetFormValues;
};

export type RegisteredPetFormProps = {
  control: Control<BookAppointmentFormValues>;
  petOptions: { label: string; value: string }[];
  hasPets: boolean;
  petIdError?: string;
  visitReasonError?: string;
  validateVisitReason: (value: string) => true | string;
};

export const RegisteredPetForm = ({
  control,
  petOptions,
  hasPets,
  petIdError,
  visitReasonError,
  validateVisitReason,
}: RegisteredPetFormProps) => {
  return (
    <div className="flex flex-col gap-[16px]">
      <FormField label="Pet name" required error={petIdError}>
        <Controller
          name="petId"
          control={control}
          render={({ field }) => (
            <SelectInput
              id="petId"
              value={field.value}
              onChange={field.onChange}
              options={petOptions}
              placeholder={
                hasPets
                  ? 'Select your pet'
                  : "You don't have registered pets yet"
              }
              disabled={!hasPets}
            />
          )}
        />
      </FormField>

      <FormField label="Reason for visit" required error={visitReasonError}>
        <Controller
          name="visitReason"
          control={control}
          rules={{ validate: validateVisitReason }}
          render={({ field }) => (
            <TextAreaInput
              id="visitReason"
              rows={4}
              placeholder="Tell us why you're visiting..."
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>
    </div>
  );
};
