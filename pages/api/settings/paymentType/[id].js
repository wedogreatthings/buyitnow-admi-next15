import { createRouter } from 'next-connect';
import dbConnect from '@/backend/config/dbConnect';
import onError from '@/backend/middlewares/errors';
import {
  authorizeRoles,
  isAuthenticatedUser,
} from '@/backend/middlewares/auth';
import { deletePayment } from '@/backend/controllers/settingsControllers';

const router = createRouter();

dbConnect();
router.use(isAuthenticatedUser, authorizeRoles('admin')).delete(deletePayment);

export default router.handler({ onError });
