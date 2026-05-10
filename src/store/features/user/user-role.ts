import { UserRole } from './user-types';

const normalizedRoleMap: Record<string, UserRole> = {
  client: UserRole.CLIENT,
  receptionist: UserRole.RECEPTIONIST,
  veterinarian: UserRole.VETERINARIAN,
  admin: UserRole.ADMIN,
};

const toComparableRole = (role?: string | null) =>
  role
    ?.trim()
    .toLowerCase()
    .replace(/^role[_\s-]*/, '');

export const normalizeUserRole = (role?: string | null): UserRole | null => {
  const normalized = toComparableRole(role);

  if (!normalized) {
    return null;
  }

  return normalizedRoleMap[normalized] ?? null;
};

export const hasAllowedRole = (
  role: string | null | undefined,
  allowedRoles?: readonly UserRole[]
) => {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  const normalizedRole = normalizeUserRole(role);

  return normalizedRole !== null && allowedRoles.includes(normalizedRole);
};

export const isClientRole = (role?: string | null) =>
  normalizeUserRole(role) === UserRole.CLIENT;

export const isReceptionistRole = (role?: string | null) =>
  normalizeUserRole(role) === UserRole.RECEPTIONIST;
