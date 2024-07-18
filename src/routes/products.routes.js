import { Router } from 'express';
import {
    createProduct,
    getProductById,
    getProductByCategory,
    updateProductDetails,
    updateProductImages,
    deleteProduct,
    getAllProducts,
    getAllProductsWithPagination
} from "../controllers/products.controller.js" 
import { verifyJWT } from '../middlewares/auth.middleware.js'; 
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/').post(verifyJWT, upload.array('images', 5), createProduct);
router.route('/all-products').get(getAllProducts)
router.route('/:productId').get(getProductById);
router.route('/categories/:categoryId').get(getProductByCategory);
router.route('/:productId').put(verifyJWT, updateProductDetails);
router.route('/:productId/images').put(verifyJWT, upload.array('images', 10), updateProductImages);
router.route('/:productId').delete(verifyJWT, deleteProduct);
router.route('/all-products/paginate').get(getAllProductsWithPagination);

export default router;
