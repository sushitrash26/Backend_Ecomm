import { Router } from 'express';
import {
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  getCartItems
} from '../controllers/cartItems.controllers.js'; // Adjust the import path as necessary

import { verifyJWT } from '../middlewares/auth.middleware.js'; // Assuming you have a middleware for verifying JWT

const router = Router();

// CartItem Routes

router.route('/add/:cartId/:productId').post(verifyJWT, addItemToCart);
router.route('/update/:cartItemId').put(verifyJWT, updateItemQuantity);
router.route('/delete/:cartItemId').delete(verifyJWT, removeItemFromCart);
router.route('/get/:cartItemId').get(verifyJWT, getCartItems);

export default router;
