import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '~/__tests__';
import { UserForm } from '~/pages/my-account-page/user-account/general-info/user-form';

describe('UserForm', () => {
  it('renders the first name, last name and phone number fields', () => {
    render(<UserForm />);

    expect(screen.getByPlaceholderText('Enter First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Last Name')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('+38(___) ___-__-__')
    ).toBeInTheDocument();
  });

  it('pre-fills inputs with initialValues', () => {
    render(
      <UserForm
        initialValues={{
          firstName: 'Taylor',
          lastName: 'Green',
          phoneNumber: '+15550000001',
        }}
      />
    );

    expect(screen.getByPlaceholderText('Enter First Name')).toHaveValue(
      'Taylor'
    );
    expect(screen.getByPlaceholderText('Enter Last Name')).toHaveValue('Green');
    expect(screen.getByPlaceholderText('+38(___) ___-__-__')).toHaveValue(
      '+15550000001'
    );
  });

  it('renders Save Changes and Cancel buttons', () => {
    render(<UserForm />);
    expect(
      screen.getByRole('button', { name: /save changes/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('Save Changes button is disabled when form is empty', () => {
    render(<UserForm />);
    expect(
      screen.getByRole('button', { name: /save changes/i })
    ).toBeDisabled();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<UserForm onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('enables Save Changes when all fields are valid', async () => {
    render(<UserForm />);

    fireEvent.change(screen.getByPlaceholderText('Enter First Name'), {
      target: { value: 'Jane' },
    });
    fireEvent.blur(screen.getByPlaceholderText('Enter First Name'));

    fireEvent.change(screen.getByPlaceholderText('Enter Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.blur(screen.getByPlaceholderText('Enter Last Name'));

    fireEvent.change(screen.getByPlaceholderText('+38(___) ___-__-__'), {
      target: { value: '+15550000001' },
    });
    fireEvent.blur(screen.getByPlaceholderText('+38(___) ___-__-__'));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /save changes/i })
      ).not.toBeDisabled();
    });
  });

  it('calls onSubmit with form values when submitted with valid data', async () => {
    const onSubmit = vi.fn();
    render(
      <UserForm
        onSubmit={onSubmit}
        initialValues={{
          firstName: 'Jane',
          lastName: 'Doe',
          phoneNumber: '+15550000001',
        }}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /save changes/i })
      ).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Doe',
        })
      );
    });
  });

  it('disables both buttons when isSubmitting is true', () => {
    render(
      <UserForm
        isSubmitting
        initialValues={{
          firstName: 'Jane',
          lastName: 'Doe',
          phoneNumber: '+15550000001',
        }}
      />
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    // Save Changes is also disabled (even if form is valid)
    expect(
      screen.getByRole('button', { name: /save changes/i })
    ).toBeDisabled();
  });
});
