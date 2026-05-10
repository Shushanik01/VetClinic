import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '~/__tests__';
import { RegisteredPetForm } from '~/components/book-appointment-form/registered-pet-form';

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

vi.mock('~/components/forms/select-input/select-input', () => ({
  SelectInput: (props: {
    id: string;
    placeholder?: string;
    disabled?: boolean;
    options: Array<{ label: string; value: string }>;
  }) => (
    <div>
      <input
        data-testid="select-input-mock"
        id={props.id}
        placeholder={props.placeholder}
      />
      <div data-testid="select-disabled">{String(Boolean(props.disabled))}</div>
      <div data-testid="select-options-count">{props.options.length}</div>
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

describe('RegisteredPetForm', () => {
  it('renders enabled pet select when pets exist', () => {
    const validateVisitReason = vi.fn().mockReturnValue(true);

    render(
      <RegisteredPetForm
        control={{} as never}
        petOptions={[
          { label: 'Milo', value: 'pet-1' },
          { label: 'Luna', value: 'pet-2' },
        ]}
        hasPets
        validateVisitReason={validateVisitReason}
      />
    );

    expect(screen.getByTestId('form-field-Pet name')).toBeInTheDocument();
    expect(
      screen.getByTestId('form-field-Reason for visit')
    ).toBeInTheDocument();

    expect(screen.getByTestId('select-input-mock')).toHaveAttribute(
      'id',
      'petId'
    );
    expect(screen.getByTestId('select-input-mock')).toHaveAttribute(
      'placeholder',
      'Select your pet'
    );
    expect(screen.getByTestId('select-disabled')).toHaveTextContent('false');
    expect(screen.getByTestId('select-options-count')).toHaveTextContent('2');

    expect(screen.getByTestId('text-area-input-mock')).toHaveAttribute(
      'id',
      'visitReason'
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

    expect(byName['visitReason']?.validate).toBe(validateVisitReason);
  });

  it('renders disabled pet select and errors when user has no pets', () => {
    render(
      <RegisteredPetForm
        control={{} as never}
        petOptions={[
          { label: "You don't have registered pets yet", value: '' },
        ]}
        hasPets={false}
        petIdError="Pet error"
        visitReasonError="Reason error"
        validateVisitReason={() => true}
      />
    );

    expect(screen.getByTestId('select-input-mock')).toHaveAttribute(
      'placeholder',
      "You don't have registered pets yet"
    );
    expect(screen.getByTestId('select-disabled')).toHaveTextContent('true');

    expect(screen.getByText('Pet error')).toBeInTheDocument();
    expect(screen.getByText('Reason error')).toBeInTheDocument();
  });
});
