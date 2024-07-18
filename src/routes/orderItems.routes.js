import { Router } from 'express';
import {
  addItemToOrder,
  removeItemFromOrder,
  updateOrderItem,
  getOrderItemsByOrderId,
  deleteOrderItem
} from '../controllers/orderItem.controllers.js'; 

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// OrderItem Routes
router.route('/:orderId').post(verifyJWT, addItemToOrder);
router.route('/:orderItemId').delete(verifyJWT, removeItemFromOrder);
router.route('/:orderItemId').put(verifyJWT, updateOrderItem);
router.route('/:orderId').get(verifyJWT, getOrderItemsByOrderId);
router.route('/:orderItemId').delete(verifyJWT, deleteOrderItem);

export default router;
