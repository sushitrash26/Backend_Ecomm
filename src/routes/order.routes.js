import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orders.controllers.js'; 

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Order Routes
router.route('/create').post(verifyJWT, createOrder);
router.route('/get-orders').get(verifyJWT, getUserOrders);
router.route('/:orderId').get(verifyJWT, getOrderById);
router.route('/:orderId/status').put(verifyJWT, updateOrderStatus);
router.route('/:orderId').delete(verifyJWT, deleteOrder);

export default router;
