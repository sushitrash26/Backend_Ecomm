import { Router } from 'express';
import {
    addReview,
    getReviewById,
    getAllReviewsOnProduct,
    updateReview,
    deleteReview
} from '../controllers/review.controllers.js'; 
import { verifyJWT } from '../middlewares/auth.middleware.js'; 

const router = Router();


router.route('/:productId').post(verifyJWT, addReview);
router.route('/:reviewId').get(getReviewById);
router.route('/products/:productId/').get(getAllReviewsOnProduct);
router.route('/:reviewId').put(verifyJWT, updateReview);
router.route('/:reviewId').delete(verifyJWT, deleteReview);

export default router;
