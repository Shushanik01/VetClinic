import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '~/__tests__';
import { NewPetForm } from '~/components/book-appointment-form/new-pet-form';

const controllerCalls: Array<{ name: string; rules?: unknown }> = [];

vi.mock('react-hook-form', () => ({
  Controller: ({
    name,
    rules,
    render,
  }: {
    name: string;
    rules?: unknown;
    render: (args: {
      field: { value: string; onChange: () => void; name: string };
    }) => React.ReactNode;
  }) => {
    controllerCalls.push({ name, rules });
    return render({ field: { value: '', onChange: vi.fn(), name } });
  },
}));

vi.mock('~/components/forms/form-field', () => ({
  FormField: ({
    label,
    required,
    error,
    children,
  }: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
  }) => (
    <div data-testid={`form-field-${label}`}>
      <div>{label}</div>
      <div>{String(required ?? false)}</div>
      {error ? <div>{error}</div> : null}
      {children}
    </div>
  ),
}));

vi.mock('~/components/forms/text-input', () => ({
  TextInput: (props: {
    id: string;
    placeholder?: string;
    maxLength?: number;
  }) => <input data-testid="text-input-mock" {...props} />,
}));

vi.mock('~/components/forms/select-input/select-input', () => ({
  SelectInput: (props: {
    id: string;
    placeholder?: string;
    options: Array<{ label: string; value: string }>;
  }) => (
    <div>
      <input
        data-testid="select-input-mock"
        id={props.id}
        placeholder={props.placeholder}
      />
      <div data-testid="select-options-count">{props.options.length}</div>
    </div>
  ),
}));

vi.mock('~/components/forms/date-input/date-input', () => ({
  CalendarInput: (props: {
    id: string;
    label?: string;
    required?: boolean;
    allowPastDates?: boolean;
    allowFutureDates?: boolean;
    clearable?: boolean;
    shouldValidate?: boolean;
    error?: string;
  }) => (
    <div data-testid="calendar-input-mock">
      <div>{props.id}</div>
      <div>{props.label}</div>
      <div>{String(props.required)}</div>
      <div>{String(props.allowPastDates)}</div>
      <div>{String(props.allowFutureDates)}</div>
      <div>{String(props.clearable)}</div>
      <div>{String(props.shouldValidate)}</div>
      {props.error ? <div>{props.error}</div> : null}
    </div>
  ),
}));

vi.mock('~/components/forms/text-area-input', () => ({
  TextAreaInput: (props: {
    id: string;
    placeholder?: string;
    rows?: number;
  }) => <textarea data-testid="text-area-input-mock" {...props} />,
}));

describe('NewPetForm', () => {
  it('renders all fields with expected props and validation rules', () => {
    const validateVisitReason = vi.fn().mockReturnValue(true);
    const validateName = vi.fn().mockReturnValue(true);
    const validateSpecies = vi.fn().mockReturnValue(true);
    const validateDateOfBirth = vi.fn().mockReturnValue(true);

    render(
      <NewPetForm
        control={{} as never}
        validateVisitReason={validateVisitReason}
        validateName={validateName}
        validateSpecies={validateSpecies}
        validateDateOfBirth={validateDateOfBirth}
      />
    );

    expect(screen.getByTestId('form-field-Pet name')).toBeInTheDocument();
    expect(screen.getByTestId('form-field-Species')).toBeInTheDocument();
    expect(
      screen.getByTestId('form-field-Reason for visit')
    ).toBeInTheDocument();

    expect(screen.getByTestId('text-input-mock')).toHaveAttribute(
      'id',
      'newPetName'
    );
    expect(screen.getByTestId('text-input-mock')).toHaveAttribute(
      'placeholder',
      "Enter Pet's Name"
    );
    expect(screen.getByTestId('text-input-mock')).toHaveAttribute(
      'maxLength',
      '80'
    );

    expect(screen.getByTestId('select-input-mock')).toHaveAttribute(
      'id',
      'newPetSpecies'
    );
    expect(screen.getByTestId('select-input-mock')).toHaveAttribute(
      'placeholder',
      'Select species'
    );
    expect(screen.getByTestId('select-options-count')).toHaveTextContent('3');

    expect(screen.getByTestId('calendar-input-mock')).toHaveTextContent(
      'newPetDateOfBirth'
    );
    expect(screen.getByTestId('calendar-input-mock')).toHaveTextContent(
      'Date of birth'
    );
    expect(screen.getByTestId('calendar-input-mock')).toHaveTextContent('true');

    expect(screen.getByTestId('text-area-input-mock')).toHaveAttribute(
      'id',
      'newPetVisitReason'
    );
    expect(screen.getByTestId('text-area-input-mock')).toHaveAttribute(
      'placeholder',
      "Tell us why you're visiting..."
    );

    const byName = Object.fromEntries(
      controllerCalls.map((item) => [
        item.name,
        item.rules as { validate?: unknown },
      ])
    );

    expect(byName['newPet.name']?.validate).toBe(validateName);
    expect(byName['newPet.species']?.validate).toBe(validateSpecies);
    expect(byName['newPet.dateOfBirth']?.validate).toBe(validateDateOfBirth);
    expect(byName['visitReason']?.validate).toBe(validateVisitReason);
  });

  it('renders error messages from props', () => {
    render(
      <NewPetForm
        control={{} as never}
        nameError="Name error"
        speciesError="Species error"
        dateOfBirthError="Date error"
        visitReasonError="Reason error"
        validateVisitReason={() => true}
        validateName={() => true}
        validateSpecies={() => true}
        validateDateOfBirth={() => true}
      />
    );

    expect(screen.getByText('Name error')).toBeInTheDocument();
    expect(screen.getByText('Species error')).toBeInTheDocument();
    expect(screen.getByText('Date error')).toBeInTheDocument();
    expect(screen.getByText('Reason error')).toBeInTheDocument();
  });
});
