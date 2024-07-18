import { Router } from 'express';
import {
  createCart,
  getCart,
  deleteCart,
  fetchLatestCart,
  refreshCart
} from '../controllers/cart.controllers.js'; 

import { verifyJWT } from '../middlewares/auth.middleware.js'; 

const router = Router();

// Cart Routes
router.route('/create').post(verifyJWT, createCart);
router.route('/latest').get(verifyJWT,fetchLatestCart)
router.route('/get').get(verifyJWT, getCart);
router.route('/delete').delete(verifyJWT, deleteCart);
router.route('/refresh').get(verifyJWT,refreshCart)

export default router;
