import { createRouter } from 'next-connect';
import dbConnect from '@/backend/config/dbConnect';
import {
  authorizeRoles,
  isAuthenticatedUser,
} from '@/backend/middlewares/auth';
import onError from '@/backend/middlewares/errors';
import {
  getProducts,
  newProduct,
} from '@/backend/controllers/productControllers';

const router = createRouter();

dbConnect();

router.use(isAuthenticatedUser, authorizeRoles('admin')).get(getProducts);
router.use(isAuthenticatedUser, authorizeRoles('admin')).post(newProduct);

export default router.handler({ onError });
