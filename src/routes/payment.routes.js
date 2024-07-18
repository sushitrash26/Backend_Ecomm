import { Router } from 'express';
import {
  createPayment,
  getPaymentById,
  getPaymentsForOrder,
  updatePaymentStatus
} from '../controllers/payment.controllers.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';


const router = Router();

// Payment Routes

router.route('/')
  .post(verifyJWT, createPayment);

router.route('/:paymentId')
  .get(verifyJWT, getPaymentById)
  .put(verifyJWT, updatePaymentStatus);

router.route('/order/:orderId')
  .get(verifyJWT, getPaymentsForOrder);

export default router;
