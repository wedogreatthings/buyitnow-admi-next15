import ErrorHandler from '../utils/errorHandler';
import { getServerSession } from 'next-auth';
import auth from '@/pages/api/auth/[...nextauth]';
import User from '../models/user';

const isAuthenticatedUser = async (req, res, next) => {
  console.log('Checking authentication for user:', req.user);
  const session = await getServerSession(req, res, auth);
  console.log('Session retrieved:', session);

  if (!session) {
    console.error('No session found. User is not authenticated.');
    return new ErrorHandler('Login first to access this route', 401);
  }

  console.log('Session user:', session.user);

  req.user = session.user;

  next();
};

const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    console.log('Authorizing user with roles:', req.user.role);
    const user = await User.findOne({ email: req.user.email }).select('role');

    if (!roles.includes(user.role)) {
      console.error(
        `User role (${user.role}) is not authorized. Required roles: ${roles.join(
          ', ',
        )}`,
      );
      return new ErrorHandler(
        `Role (${user.role}) is not allowed to access this resource.`,
      );
    }

    console.log('User is authorized:', user.role);

    next();
  };
};

export { isAuthenticatedUser, authorizeRoles };
