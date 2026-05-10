import { FormField } from '~/components/forms/form-field';
import { TextInput } from '~/components/forms/text-input';
import { SelectInput } from '~/components/forms/select-input/select-input';
import { CalendarInput } from '~/components/forms/date-input/date-input';

export type PetFormValues = {
  id?: string;
  name: string;
  species: string;
  breed: string;
  dateOfBirth: string;
  sex: string;
};

const SPECIES_OPTIONS = [
  { label: 'Dog', value: 'dog' },
  { label: 'Cat', value: 'cat' },
  { label: 'Other', value: 'other' },
];

const SEX_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Unknown', value: 'unknown' },
];

type PetFormFieldsProps = {
  values: PetFormValues;
  onChange: (values: PetFormValues) => void;
  /**
   * When true, show optional fields (breed, sex).
   * When false, only mandatory fields are rendered.
   */
  includeOptional?: boolean;
  nameError?: string;
  speciesError?: string;
  dateOfBirthError?: string;
};

export const PetFormFields = ({
  values,
  onChange,
  includeOptional = true,
  nameError,
  speciesError,
  dateOfBirthError,
}: PetFormFieldsProps) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[552px]">
      <FormField
        label="Pet name"
        required
        error={nameError}
        className="w-full max-w-[552px]"
      >
        <TextInput
          value={values.name}
          onChange={(event) =>
            onChange({
              ...values,
              name: event.target.value,
            })
          }
          className="max-w-[552px]"
          maxLength={80}
        />
      </FormField>

      <FormField
        label="Species"
        required
        error={speciesError}
        className="w-full max-w-[552px]"
      >
        <SelectInput
          value={values.species}
          onChange={(value) =>
            onChange({
              ...values,
              species: value,
            })
          }
          options={SPECIES_OPTIONS}
          placeholder="Select species"
        />
      </FormField>

      <div className="w-full max-w-[552px]">
        <CalendarInput
          value={values.dateOfBirth}
          onChange={(date) =>
            onChange({
              ...values,
              dateOfBirth: date,
            })
          }
          allowPastDates
          allowFutureDates={false}
          clearable
          label="Date of birth"
          shouldValidate={true}
          error={dateOfBirthError}
        />
      </div>

      {includeOptional && (
        <>
          <FormField label="Breed" className="w-full max-w-[552px]">
            <TextInput
              value={values.breed}
              onChange={(event) =>
                onChange({
                  ...values,
                  breed: event.target.value,
                })
              }
              className="max-w-[552px]"
              maxLength={80}
            />
          </FormField>

          <FormField label="Sex" className="w-full max-w-[552px]">
            <SelectInput
              value={values.sex}
              onChange={(value) =>
                onChange({
                  ...values,
                  sex: value,
                })
              }
              options={SEX_OPTIONS}
              placeholder="Select sex"
              clearable
            />
          </FormField>
        </>
      )}
    </div>
  );
};
