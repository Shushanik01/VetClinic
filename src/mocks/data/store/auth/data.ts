import type { UserRole } from '~/store/features/user/user-types';

export type MockUserAccount = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: UserRole;
};

type MockSession = {
  token: string;
  userId: string;
};

export const users: MockUserAccount[] = [
  {
    userId: 'client-1',
    firstName: 'Taylor',
    lastName: 'Green',
    email: 'client@vetcare.dev',
    password: 'Client123!',
    phoneNumber: '+15550000001',
    role: 'Client',
  },
  {
    userId: 'client-2',
    firstName: 'Jordan',
    lastName: 'Miller',
    email: 'client2@vetcare.dev',
    password: 'Client234!',
    phoneNumber: '+15550000005',
    role: 'Client',
  },
  {
    userId: 'receptionist-1',
    firstName: 'Morgan',
    lastName: 'Hill',
    email: 'reception@vetcare.dev',
    password: 'Reception123!',
    phoneNumber: '+15550000002',
    role: 'Receptionist',
  },
  {
    userId: 'vet-1',
    firstName: 'Jennifer',
    lastName: 'Lee',
    email: 'vet@vetcare.dev',
    password: 'Vet123456!',
    phoneNumber: '+15550000003',
    role: 'Veterinarian',
  },
  {
    userId: 'admin-1',
    firstName: 'Casey',
    lastName: 'Brooks',
    email: 'admin@vetcare.dev',
    password: 'Admin12345!',
    phoneNumber: '+15550000004',
    role: 'Admin',
  },
];

export const sessionsByToken = new Map<string, MockSession>();

// Helper functions
export const encodeBase64Url = (value: string): string => {
  const base64 = btoa(value);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

export const createUnsignedJwt = (payload: Record<string, unknown>): string => {
  const header = { alg: 'none', typ: 'JWT' };
  return `${encodeBase64Url(JSON.stringify(header))}.${encodeBase64Url(JSON.stringify(payload))}.`;
};

export const buildUserName = (firstName: string, lastName: string): string =>
  [firstName, lastName].filter(Boolean).join(' ').trim();

export const createSessionToken = (user: MockUserAccount): string => {
  const now = Math.floor(Date.now() / 1000);
  return createUnsignedJwt({
    sub: user.userId,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    name: buildUserName(user.firstName, user.lastName),
    iat: now,
    exp: now + 60 * 60 * 24,
  });
};

export const getUserByEmail = (email: string): MockUserAccount | null => {
  const normalized = email.trim().toLowerCase();
  return users.find((user) => user.email.toLowerCase() === normalized) ?? null;
};

export const getUserById = (userId: string): MockUserAccount | null =>
  users.find((user) => user.userId === userId) ?? null;

export const getUsersByRole = (role: UserRole): MockUserAccount[] =>
  users.filter((user) => user.role === role);
