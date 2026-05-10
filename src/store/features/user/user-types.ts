export const UserRole = {
  CLIENT: 'Client',
  RECEPTIONIST: 'Receptionist',
  VETERINARIAN: 'Veterinarian',
  ADMIN: 'Admin',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type User = {
  userId: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  clinic?: {
    clinicId?: string;
    clinicAddress?: string;
  };
};
