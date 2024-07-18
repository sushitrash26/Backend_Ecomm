import { Router } from 'express';
import {
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/category.controllers.js'; 

import { verifyJWT } from '../middlewares/auth.middleware.js'; 

const router = Router();

// Category Routes
router.route('/')
  .post(verifyJWT, createCategory);

router.route('/:categoryId')
  .get(verifyJWT, getCategoryById)
  .put(verifyJWT, updateCategory)
  .delete(verifyJWT, deleteCategory);

export default router;
