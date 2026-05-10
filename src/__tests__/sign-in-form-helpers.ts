import { fireEvent, screen } from '~/__tests__';

export const VALID_SIGN_IN_FORM_DATA = {
  email: 'client@vetcare.dev',
  password: 'Client123!',  // NOSONAR
}; //this is test-only data and not a real credential

type SignInDataOverrides = Partial<typeof VALID_SIGN_IN_FORM_DATA>;

export const fillSignInForm = (overrides: SignInDataOverrides = {}) => {
  const data = { ...VALID_SIGN_IN_FORM_DATA, ...overrides };

  const emailInput = screen.getByPlaceholderText('Enter your Email');
  fireEvent.input(emailInput, { target: { value: data.email } });
  fireEvent.change(emailInput, { target: { value: data.email } });
  fireEvent.blur(emailInput);

  const passwordInput = screen.getByPlaceholderText('Enter your Password');
  fireEvent.input(passwordInput, { target: { value: data.password } });
  fireEvent.change(passwordInput, { target: { value: data.password } });
  fireEvent.blur(passwordInput);

  return data;
};

export const submitSignInForm = () => {
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
};
