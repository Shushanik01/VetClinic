import { fireEvent, screen } from '~/__tests__';

export const VALID_SIGN_UP_FORM_DATA = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@vetcare.dev',
  phoneNumber: '+1 (555) 000-0011',
  password: 'StrongPass1!', // NOSONAR
  confirmPassword: 'StrongPass1!', // NOSONAR
};

type SignUpDataOverrides = Partial<typeof VALID_SIGN_UP_FORM_DATA>;

export const fillSignUpForm = (overrides: SignUpDataOverrides = {}) => {
  const data = { ...VALID_SIGN_UP_FORM_DATA, ...overrides };

  const firstNameInput = screen.getByPlaceholderText('Enter First Name');
  fireEvent.change(firstNameInput, {
    target: { value: data.firstName },
  });
  fireEvent.blur(firstNameInput);

  const lastNameInput = screen.getByPlaceholderText('Enter Last Name');
  fireEvent.change(lastNameInput, {
    target: { value: data.lastName },
  });
  fireEvent.blur(lastNameInput);

  const emailInput = screen.getByPlaceholderText('Enter your Email');
  fireEvent.change(emailInput, {
    target: { value: data.email },
  });
  fireEvent.blur(emailInput);

  const phoneInput = screen.getByPlaceholderText('+38(___) ___-__-__');
  fireEvent.change(phoneInput, {
    target: { value: data.phoneNumber },
  });
  fireEvent.blur(phoneInput);

  const passwordInput = screen.getByPlaceholderText('Enter your Password');
  fireEvent.change(passwordInput, {
    target: { value: data.password },
  });

  fireEvent.change(screen.getByPlaceholderText('Confirm your Password'), {
    target: { value: data.confirmPassword },
  });

  return data;
};

export const submitSignUpForm = () => {
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));
};
