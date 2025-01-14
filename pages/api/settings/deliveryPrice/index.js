import { createRouter } from 'next-connect';
import dbConnect from '@/backend/config/dbConnect';
import {
  authorizeRoles,
  isAuthenticatedUser,
} from '@/backend/middlewares/auth';
import onError from '@/backend/middlewares/errors';
import {
  getDeliveryPrice,
  newDeliveryPrice,
} from '@/backend/controllers/settingsControllers';

const router = createRouter();

dbConnect();

router.use(isAuthenticatedUser, authorizeRoles('admin')).get(getDeliveryPrice);
router.use(isAuthenticatedUser, authorizeRoles('admin')).post(newDeliveryPrice);

export default router.handler({ onError });
