import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '~/__tests__';
import {
  PetFormFields,
  type PetFormValues,
} from '~/pages/my-account-page/user-account/pets/pet-form/pet-form-fields';

// Mock CalendarInput to avoid complex date-picker rendering
vi.mock('~/components/forms/date-input/date-input', () => ({
  CalendarInput: ({ label, error, onChange, value }: any) => (
    <div>
      <label>{label}</label>
      <input
        aria-label={label}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        data-testid="calendar-input"
      />
      {error && <span>{error}</span>}
    </div>
  ),
}));

const defaultValues: PetFormValues = {
  name: '',
  species: '',
  breed: '',
  dateOfBirth: '',
  sex: '',
};

describe('PetFormFields', () => {
  it('renders Pet name, Species, and Date of birth fields', () => {
    render(<PetFormFields values={defaultValues} onChange={vi.fn()} />);

    expect(screen.getByText('Pet name')).toBeInTheDocument();
    expect(screen.getByText('Species')).toBeInTheDocument();
    expect(screen.getByText('Date of birth')).toBeInTheDocument();
  });

  it('renders optional Breed and Sex fields when includeOptional is true', () => {
    render(
      <PetFormFields
        values={defaultValues}
        onChange={vi.fn()}
        includeOptional
      />
    );

    expect(screen.getByText('Breed')).toBeInTheDocument();
    expect(screen.getByText('Sex')).toBeInTheDocument();
  });

  it('does not render Breed and Sex when includeOptional is false', () => {
    render(
      <PetFormFields
        values={defaultValues}
        onChange={vi.fn()}
        includeOptional={false}
      />
    );

    expect(screen.queryByText('Breed')).not.toBeInTheDocument();
    expect(screen.queryByText('Sex')).not.toBeInTheDocument();
  });

  it('calls onChange when pet name is typed', () => {
    const onChange = vi.fn();
    render(<PetFormFields values={defaultValues} onChange={onChange} />);

    const nameInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(nameInput, { target: { value: 'Buddy' } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Buddy' })
    );
  });

  it('shows dateOfBirthError when provided', () => {
    render(
      <PetFormFields
        values={defaultValues}
        onChange={vi.fn()}
        dateOfBirthError="Date of birth cannot be in the future"
      />
    );

    expect(
      screen.getByText('Date of birth cannot be in the future')
    ).toBeInTheDocument();
  });

  it('shows nameError when provided', () => {
    render(
      <PetFormFields
        values={defaultValues}
        onChange={vi.fn()}
        nameError="Name is required"
      />
    );

    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  it('pre-fills name input with the provided value', () => {
    render(
      <PetFormFields
        values={{ ...defaultValues, name: 'Buddy' }}
        onChange={vi.fn()}
      />
    );

    // The name input has value "Buddy" - find by value
    const inputs = screen.getAllByRole('textbox');
    const nameInput = inputs.find(
      (input) => (input as HTMLInputElement).value === 'Buddy'
    );
    expect(nameInput).toBeDefined();
  });
});
