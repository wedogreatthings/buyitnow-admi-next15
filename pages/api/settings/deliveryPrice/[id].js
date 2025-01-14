import { createRouter } from 'next-connect';
import dbConnect from '@/backend/config/dbConnect';
import onError from '@/backend/middlewares/errors';
import {
  authorizeRoles,
  isAuthenticatedUser,
} from '@/backend/middlewares/auth';
import { deleteDeliveryPrice } from '@/backend/controllers/settingsControllers';

const router = createRouter();

dbConnect();
router
  .use(isAuthenticatedUser, authorizeRoles('admin'))
  .delete(deleteDeliveryPrice);

export default router.handler({ onError });
