import { createRouter } from 'next-connect';
import dbConnect from '@/backend/config/dbConnect';
import onError from '@/backend/middlewares/errors';
import {
  authorizeRoles,
  isAuthenticatedUser,
} from '@/backend/middlewares/auth';
import { getOrdersPurchasedStats } from '@/backend/controllers/ordersControllers';

const router = createRouter();

dbConnect();

router
  .use(isAuthenticatedUser, authorizeRoles('admin'))
  .get(getOrdersPurchasedStats);

export default router.handler({ onError });
