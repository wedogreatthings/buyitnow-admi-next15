import { createRouter } from 'next-connect';
import dbConnect from '@/backend/config/dbConnect';
import onError from '@/backend/middlewares/errors';
import {
  authorizeRoles,
  isAuthenticatedUser,
} from '@/backend/middlewares/auth';
import {
  deleteUser,
  getUser,
  updateUser,
} from '@/backend/controllers/authControllers';

const router = createRouter();

dbConnect();

router.use(isAuthenticatedUser, authorizeRoles('admin')).get(getUser);
router.use(isAuthenticatedUser, authorizeRoles('admin')).put(updateUser);
router.use(isAuthenticatedUser, authorizeRoles('admin')).delete(deleteUser);

export default router.handler({ onError });
