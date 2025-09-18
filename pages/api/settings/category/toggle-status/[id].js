import { createRouter } from 'next-connect';
import dbConnect from '@/backend/config/dbConnect';
import onError from '@/backend/middlewares/errors';
import {
  authorizeRoles,
  isAuthenticatedUser,
} from '@/backend/middlewares/auth';
import { toggleCategoryStatus } from '@/backend/controllers/settingsControllers';

const router = createRouter();

dbConnect();
router
  .use(isAuthenticatedUser, authorizeRoles('admin'))
  .patch(toggleCategoryStatus);

export default router.handler({ onError });
