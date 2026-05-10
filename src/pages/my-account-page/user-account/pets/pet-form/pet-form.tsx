import { type SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { validateDateInputValue } from '~/components/forms/date-input/components/utils';

import { PetFormFields, type PetFormValues } from './pet-form-fields';

const getDateOfBirthError = (value: string): string | undefined => {
  const validationError = validateDateInputValue(value, {
    required: true,
    allowPastDates: true,
    allowFutureDates: false,
  });

  if (!validationError) return undefined;

  return validationError === 'Date cannot be in the future'
    ? 'Date of birth cannot be in the future'
    : validationError;
};

type PetFormProps = {
  /** Show optional fields (breed, sex) when true. */
  includeOptional?: boolean;
  /**
   * Called when user submits the form and all mandatory
   * fields are filled.
   */
  onSubmit?: (values: PetFormValues) => void;
  /** Called when user presses Cancel. */
  onCancel?: () => void;
  /** Optional initial values when editing existing pet. */
  initialValues?: Partial<PetFormValues>;
  /** Optional extra classes to adjust size/layout of the form wrapper. */
  className?: string;
  /** Optional flag to indicate submit is in progress. */
  isSubmitting?: boolean;
  /** Optional mode to adjust labels for create vs edit. */
  mode?: 'create' | 'edit';
};

const getInitialValues = (
  initialValues?: Partial<PetFormValues>
): PetFormValues => ({
  id: initialValues?.id,
  name: initialValues?.name ?? '',
  species: initialValues?.species ?? '',
  breed: initialValues?.breed ?? '',
  dateOfBirth: initialValues?.dateOfBirth ?? '',
  sex: initialValues?.sex ?? '',
});

export const PetForm = ({
  includeOptional = true,
  onSubmit,
  onCancel,
  initialValues,
  className = '',
  isSubmitting = false,
  mode = 'create',
}: PetFormProps) => {
  const [values, setValues] = useState<PetFormValues>(() =>
    getInitialValues(initialValues)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setValues(getInitialValues(initialValues));
    setIsSubmitted(false);
  }, [initialValues]);

  const dateOfBirthError = useMemo(
    () => getDateOfBirthError(values.dateOfBirth),
    [values.dateOfBirth]
  );

  const isValid = useMemo(() => {
    const hasName = values.name.trim().length > 0;
    const hasSpecies = values.species.trim().length > 0;
    const hasValidDob = !dateOfBirthError;

    return hasName && hasSpecies && hasValidDob;
  }, [values.name, values.species, dateOfBirthError]);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (!isValid) return;
    onSubmit?.(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-neutral-0 w-full max-w-[552px] min-w-[320px] flex flex-col gap-[24px] rounded-[16px] p-[24px] ${className}`}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-h3 text-black-900">
          {mode === 'edit' ? 'Edit pet' : 'Add pet'}
        </h2>
        <p className="text-body-m-regular text-neutral-600">
          Fill in the details below{' '}
          {mode === 'edit' ? 'to update this pet.' : 'to add a new pet.'}
        </p>
      </div>

      <PetFormFields
        values={values}
        onChange={setValues}
        includeOptional={includeOptional}
        dateOfBirthError={isSubmitted ? dateOfBirthError : undefined}
      />

      <div className="mt-auto flex justify-end gap-4">
        <button
          type="button"
          className="btn-white-l disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-regular-l disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid || isSubmitting}
        >
          Submit
        </button>
      </div>
    </form>
  );
};
