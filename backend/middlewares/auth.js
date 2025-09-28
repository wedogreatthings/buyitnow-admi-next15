import ErrorHandler from '../utils/errorHandler';
import { getServerSession } from 'next-auth';
import User from '../models/user';
import { auth } from '@/app/api/auth/[...nextauth]/route';

const isAuthenticatedUser = async (req, res, next) => {
  const session = await getServerSession(req, res, auth);

  if (!session) {
    return new ErrorHandler('Login first to access this route', 401);
  }

  req.user = session.user;

  next();
};

const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email }).select('role');

    if (!roles.includes(user.role)) {
      return new ErrorHandler(
        `Role (${user.role}) is not allowed to access this resource.`,
      );
    }

    next();
  };
};

export { isAuthenticatedUser, authorizeRoles };
