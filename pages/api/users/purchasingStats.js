import { createRouter } from 'next-connect';
import dbConnect from '@/backend/config/dbConnect';
import onError from '@/backend/middlewares/errors';
import {
  authorizeRoles,
  isAuthenticatedUser,
} from '@/backend/middlewares/auth';
import { getPurchasingsStats } from '@/backend/controllers/authControllers';

const router = createRouter();

dbConnect();

router
  .use(isAuthenticatedUser, authorizeRoles('admin'))
  .get(getPurchasingsStats);

export default router.handler({ onError });
