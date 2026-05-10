import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '~/__tests__';
import { PetForm } from '~/pages/my-account-page/user-account/pets/pet-form/pet-form';

// Mock CalendarInput to avoid complex calendar rendering
vi.mock('~/components/forms/date-input/date-input', () => ({
  CalendarInput: ({ label, error, onChange, value }: any) => (
    <div>
      <label>{label}</label>
      <input
        aria-label={label}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {error && <span role="alert">{error}</span>}
    </div>
  ),
}));

describe('PetForm', () => {
  it('renders "Add pet" heading in create mode', () => {
    render(<PetForm mode="create" />);
    expect(screen.getByText('Add pet')).toBeInTheDocument();
  });

  it('renders "Edit pet" heading in edit mode', () => {
    render(<PetForm mode="edit" />);
    expect(screen.getByText('Edit pet')).toBeInTheDocument();
  });

  it('renders Submit and Cancel buttons', () => {
    render(<PetForm />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('Submit button is disabled when required fields are empty', () => {
    render(<PetForm />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = vi.fn();
    render(<PetForm onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('disables Submit and Cancel when isSubmitting is true', () => {
    render(
      <PetForm
        isSubmitting
        initialValues={{
          name: 'Buddy',
          species: 'dog',
          dateOfBirth: '2022-01-01',
        }}
      />
    );
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });

  it('enables Submit when required fields are filled with valid data', async () => {
    render(<PetForm />);

    // Fill name
    const nameInputs = screen.getAllByRole('textbox');
    // First textbox is pet name
    fireEvent.change(nameInputs[0], { target: { value: 'Buddy' } });

    // Fill date of birth with a past date via the mocked calendar input
    const calendarInput = screen.getByRole('textbox', {
      name: /date of birth/i,
    });
    fireEvent.change(calendarInput, { target: { value: '2022-01-01' } });

    await waitFor(() => {
      // Submit should still be disabled because species is not selected yet
      // (SelectInput is NOT mocked, so we must interact with it)
    });

    // Open species select and pick an option
    const speciesInput = screen
      .getAllByRole('textbox')
      .find((el) => (el as HTMLInputElement).placeholder === 'Select species');
    expect(speciesInput).toBeDefined();
    fireEvent.click(speciesInput!);

    const dogButton = screen
      .getAllByRole('button')
      .find((btn) => btn.textContent?.trim() === 'Dog');
    fireEvent.click(dogButton!);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /submit/i })
      ).not.toBeDisabled();
    });
  });

  it('calls onSubmit with form values when submitted', async () => {
    const onSubmit = vi.fn();
    render(
      <PetForm
        onSubmit={onSubmit}
        initialValues={{
          name: 'Buddy',
          species: 'dog',
          breed: 'Labrador',
          dateOfBirth: '2022-01-01',
          sex: 'Male',
        }}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /submit/i })
      ).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Buddy',
          species: 'dog',
        })
      );
    });
  });

  it('pre-fills form with initialValues', () => {
    render(
      <PetForm
        initialValues={{
          name: 'Luna',
          species: 'cat',
          breed: 'Siamese',
          dateOfBirth: '2021-07-22',
          sex: '',
        }}
      />
    );

    const textboxes = screen.getAllByRole('textbox');
    const nameInput = textboxes.find(
      (el) => (el as HTMLInputElement).value === 'Luna'
    );
    expect(nameInput).toBeDefined();
  });

  it('shows date error when isSubmitted and date is invalid', async () => {
    const { container } = render(<PetForm />);

    // Fill only name and species, submit with empty date
    const nameInputs = screen.getAllByRole('textbox');
    fireEvent.change(nameInputs[0], { target: { value: 'Buddy' } });

    const speciesInput = screen
      .getAllByRole('textbox')
      .find((el) => (el as HTMLInputElement).placeholder === 'Select species');
    fireEvent.click(speciesInput!);
    const dogButton = screen
      .getAllByRole('button')
      .find((btn) => btn.textContent?.trim() === 'Dog');
    fireEvent.click(dogButton!);

    // Submit the form directly to trigger validation state even when button is disabled
    const form = container.querySelector('form');
    expect(form).toBeTruthy();
    fireEvent.submit(form!);

    await waitFor(() => {
      // The date error should appear after submission attempt
      expect(screen.getByText('Date is required')).toBeInTheDocument();
    });
  });
});
