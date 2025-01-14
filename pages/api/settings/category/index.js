import { createRouter } from 'next-connect';
import dbConnect from '@/backend/config/dbConnect';
import {
  authorizeRoles,
  isAuthenticatedUser,
} from '@/backend/middlewares/auth';
import onError from '@/backend/middlewares/errors';
import {
  getCategories,
  newCategory,
} from '@/backend/controllers/settingsControllers';

const router = createRouter();

dbConnect();

router.use(isAuthenticatedUser, authorizeRoles('admin')).get(getCategories);
router.use(isAuthenticatedUser, authorizeRoles('admin')).post(newCategory);

export default router.handler({ onError });
