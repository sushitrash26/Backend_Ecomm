import { Router } from 'express';
import {
  addAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  getUserLastAddress
} from '../controllers/address.controllers.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Address Routes
router.route('/add')
  .post(verifyJWT, addAddress);

router.route('/:userId')
  .get(verifyJWT, getAllAddresses);

router.route('/:addressId')
  .get(verifyJWT, getAddressById)
  .put(verifyJWT, updateAddress)
  .delete(verifyJWT, deleteAddress);

router.route('/latest').get(verifyJWT,getUserLastAddress)

export default router;
