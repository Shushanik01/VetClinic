export type ProfileResponse = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
};

export type ProfileUpdateRequest = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export type PasswordChangeRequest = {
  oldPassword: string;
  newPassword: string;
};

export type PasswordChangeResponse = {
  message?: string;
};

export type RequestEmailChangeRequest = {
  newEmail: string;
  password: string;
};

export type RequestEmailChangeResponse = {
  message?: string;
};

export type VerifyEmailCodeRequest = {
  verificationCode: string;
};

export type VerifyEmailCodeResponse = {
  message?: string;
};
