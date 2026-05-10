import { useState } from 'react';
import styles from './popup.module.css';
import gStyles from '../globalAppointment.module.css';
import AppointmentDetails from '../Create-appointment/AppointmentDetails';
import ClientDetails from '../Client/ClientDetails';
import PetDetails from '../PetDetail/PetDetails';
import Checkbox from '~/assets/svg/Checkbox.svg';
import { details } from '../mockData';
import type { Data } from '../table/table';
import { useBookAppointmentMutation } from '~/store/api/appointments/appointment-api';
import { notify } from '~/app/providers/notifications/notifications';
import {
  buildBookAppointmentRequest,
  buildClientName,
  buildFallbackPetName,
  buildNewAppointment,
  buildPetAge,
  collectStepData,
  getSubmitButtonLabel,
} from './popup.helpers';

type CreateAppointmentFlowProps = Readonly<{
  onClose: () => void;
  onCreateAppointment?: (appointment: Data) => void;
}>;

export const CreateAppointmentFlow = ({
  onClose,
  onCreateAppointment,
}: CreateAppointmentFlowProps) => {
  const [step, setStep] = useState(0);
  const [collectedData, setCollectedData] = useState<Record<string, string>>(
    {}
  );
  const [isFormValid, setIsFormValid] = useState(false);
  const [clientPets, setClientPets] = useState<
    Array<{ petId: string; name: string }>
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookAppointment] = useBookAppointmentMutation();

  const submitFinalStep = async (allData: Record<string, string>) => {
    const clientName = buildClientName(allData);
    const fallbackPetName = buildFallbackPetName(allData);
    const petAge = buildPetAge(allData.dateOfBirth);
    const request = buildBookAppointmentRequest(allData);

    setIsSubmitting(true);

    try {
      const result = await bookAppointment(request).unwrap();
      const newAppointment = buildNewAppointment({
        result,
        allData,
        clientName,
        fallbackPetName,
        petAge,
      });

      onCreateAppointment?.(newAppointment);
      notify({
        description: 'Appointment created successfully.',
        type: 'success',
      });
      onClose();
    } catch {
      notify({
        description: 'Failed to create appointment. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const form = (e.target as HTMLElement).closest('form');

    if (!form?.checkValidity()) {
      form?.reportValidity();
      return;
    }

    const stepData = collectStepData(form);
    const allData = { ...collectedData, ...stepData };
    const isLastStep = step === details.length - 1;

    if (isLastStep) {
      await submitFinalStep(allData);
      return;
    }

    setCollectedData(allData);
    setStep((currentStep) => currentStep + 1);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((currentStep) => currentStep - 1);
    }
  };

  const getStepClassName = (index: number): string => {
    let stepStateClass = '';

    if (index === step) {
      stepStateClass = styles.active;
    } else if (index < step) {
      stepStateClass = styles.done;
    }

    return `${styles.step} ${stepStateClass}`;
  };

  const submitLabel = getSubmitButtonLabel(
    step === details.length - 1,
    isSubmitting
  );

  const renderStepForm = (s: number) => {
    const isActiveStep = step === s;
    const validChangeHandler = isActiveStep ? setIsFormValid : undefined;

    return (
      <form
        key={`create-form-step-${s}`}
        className={styles.formWrapper}
        style={{ display: isActiveStep ? undefined : 'none' }}
      >
        {s === 0 && <AppointmentDetails onValidChange={validChangeHandler} />}
        {s === 1 && (
          <ClientDetails
            onValidChange={validChangeHandler}
            onClientSelect={(_, pets) => setClientPets(pets)}
          />
        )}
        {s === 2 && (
          <PetDetails
            onValidChange={validChangeHandler}
            clientPets={clientPets}
          />
        )}

        <div className={gStyles.buttons}>
          {step > 0 && (
            <button
              type="button"
              className="btn-white-l"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Back
            </button>
          )}

          <button
            type="submit"
            className="btn-regular-l"
            disabled={!isFormValid || isSubmitting}
            onClick={handleContinue}
          >
            {submitLabel}
          </button>
        </div>
      </form>
    );
  };

  return (
    <section>
      <div className={styles.details}>
        {details.map((detail, index) => (
          <div key={detail.name} className={styles.stepWrapper}>
            <span className={getStepClassName(index)}>
              {index < step ? <img src={Checkbox} alt="Checked" /> : index + 1}
            </span>
            <span> {detail.name}</span>
          </div>
        ))}
      </div>
      {[0, 1, 2].map(renderStepForm)}
    </section>
  );
};
