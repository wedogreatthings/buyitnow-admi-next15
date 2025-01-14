import { createRouter } from 'next-connect';
import dbConnect from '@/backend/config/dbConnect';
import {
  authorizeRoles,
  isAuthenticatedUser,
} from '@/backend/middlewares/auth';
import onError from '@/backend/middlewares/errors';
import {
  getPaymentType,
  newPayment,
} from '@/backend/controllers/settingsControllers';

const router = createRouter();

dbConnect();

router.use(isAuthenticatedUser, authorizeRoles('admin')).get(getPaymentType);
router.use(isAuthenticatedUser, authorizeRoles('admin')).post(newPayment);

export default router.handler({ onError });
