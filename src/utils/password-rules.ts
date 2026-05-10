export const passwordRules = [
  {
    key: 'uppercase',
    test: (value: string) => /[A-Z]/.test(value),
    label: 'At least one uppercase letter required',
  },
  {
    key: 'lowercase',
    test: (value: string) => /[a-z]/.test(value),
    label: 'At least one lowercase letter required',
  },
  {
    key: 'number',
    test: (value: string) => /[0-9]/.test(value),
    label: 'At least one number required',
  },
  {
    key: 'special',
    test: (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
    label: 'At least one special character required',
  },
  {
    key: 'length',
    test: (value: string) => value.length >= 8 && value.length <= 16,
    label: 'Password must be 8-16 characters long',
  },
];
