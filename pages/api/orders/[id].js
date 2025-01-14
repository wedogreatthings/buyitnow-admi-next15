import { createRouter } from 'next-connect';
import dbConnect from '@/backend/config/dbConnect';
import onError from '@/backend/middlewares/errors';
import {
  authorizeRoles,
  isAuthenticatedUser,
} from '@/backend/middlewares/auth';
import {
  deleteOrder,
  getOrder,
  updateOrder,
} from '@/backend/controllers/ordersControllers';

const router = createRouter();

dbConnect();

router.use(isAuthenticatedUser, authorizeRoles('admin')).get(getOrder);
router.use(isAuthenticatedUser, authorizeRoles('admin')).put(updateOrder);
router.use(isAuthenticatedUser, authorizeRoles('admin')).delete(deleteOrder);

export default router.handler({ onError });
