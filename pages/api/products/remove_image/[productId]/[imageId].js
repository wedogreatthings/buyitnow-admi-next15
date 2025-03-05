import { createRouter } from 'next-connect';
import dbConnect from '@/backend/config/dbConnect';
import onError from '@/backend/middlewares/errors';
import {
  authorizeRoles,
  isAuthenticatedUser,
} from '@/backend/middlewares/auth';
import { removeProductImage } from '@/backend/controllers/productControllers';

const router = createRouter();

dbConnect();

export const config = {
  api: {
    bodyParser: false,
  },
};

router.delete(
  '/remove_image/:productId/:imageId',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  removeProductImage,
);

export default router.handler({ onError });
