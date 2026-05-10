import type { User } from '~/store/features/user/user-types';

const toTrimmed = (value?: string | null) => (value ?? '').trim();

export const getNameParts = (fullName?: string | null) => {
  const normalizedName = toTrimmed(fullName);

  if (!normalizedName) {
    return { firstName: '', lastName: '' };
  }

  const [firstName = '', ...lastNameParts] = normalizedName
    .split(/\s+/)
    .filter(Boolean);

  return {
    firstName,
    lastName: lastNameParts.join(' '),
  };
};

export const buildUserName = (
  firstName?: string | null,
  lastName?: string | null,
  fallbackUserName?: string | null
) => {
  const normalizedFirstName = toTrimmed(firstName);
  const normalizedLastName = toTrimmed(lastName);

  const fullName = [normalizedFirstName, normalizedLastName]
    .filter(Boolean)
    .join(' ');

  return fullName || toTrimmed(fallbackUserName);
};

export const getUserFirstName = (user?: Partial<User> | null) => {
  const normalizedFirstName = toTrimmed(user?.firstName);
  if (normalizedFirstName) return normalizedFirstName;

  return getNameParts(user?.userName).firstName;
};

export const getUserLastName = (user?: Partial<User> | null) => {
  const normalizedLastName = toTrimmed(user?.lastName);
  if (normalizedLastName) return normalizedLastName;

  return getNameParts(user?.userName).lastName;
};

export const getUserDisplayName = (user?: Partial<User> | null) => {
  return buildUserName(user?.firstName, user?.lastName, user?.userName);
};
