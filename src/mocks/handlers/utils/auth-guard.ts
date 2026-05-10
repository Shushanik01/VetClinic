import { HttpResponse } from 'msw';
import { authEntity } from '~/mocks/data/store/auth';
import type { UserRole } from '~/store/features/user/user-types';

export type AuthContext = {
  userId: string;
  role: UserRole;
};

const readBearerToken = (request: Request): string | null => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
};

export const requireAuth = (
  request: Request
): { context: AuthContext } | { response: Response } => {
  const token = readBearerToken(request);

  if (!token) {
    return {
      response: HttpResponse.json(
        { message: 'Unauthorized: missing Bearer token.' },
        { status: 401 }
      ),
    };
  }

  const user = authEntity.resolveUserByToken(token);

  if (!user) {
    return {
      response: HttpResponse.json(
        { message: 'Unauthorized: invalid or expired token.' },
        { status: 401 }
      ),
    };
  }

  return {
    context: { userId: user.userId, role: user.role },
  };
};

export const requireRole = (
  context: AuthContext,
  allowedRoles: UserRole[]
): { response: Response } | null => {
  if (allowedRoles.includes(context.role)) {
    return null;
  }

  return {
    response: HttpResponse.json(
      { message: 'Forbidden: insufficient permissions.' },
      { status: 403 }
    ),
  };
};
