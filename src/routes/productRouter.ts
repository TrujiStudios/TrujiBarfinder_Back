
import express from 'express';
import { createCategoryController, deleteCategoryController, getCategoriesController, updateCategoryController } from '../controllers/products/categoriesController';
// import { validate } from '../middlewares/validate';
// import { createCategorySchema } from '../utils/validation/categoryValidate';
import { authenticateToken } from '../middlewares/authentication/auth';
import { createProductController, deleteProductController, getProductsController, updateProductController } from '../controllers/products/productController';


const router = express.Router();

// 
// create category
// router.post('/category/create',
//     [
//         validate(createCategorySchema)
//         , authenticateToken
//     ], createCategoryController);
router.post('/category/create', authenticateToken, createCategoryController);

//get categories
router.get('/category/get', authenticateToken, getCategoriesController);

//update category
router.put('/category/update/:categoryId', authenticateToken, updateCategoryController);

//delete category
router.delete('/category/delete/:categoryId', authenticateToken, deleteCategoryController);


//  PRODUCTS ROUTES

//create product
router.post('/create', authenticateToken, createProductController);

// get products
router.get('/get', authenticateToken, getProductsController);

//update product
router.put('/update/:productId', authenticateToken, updateProductController);

//delete product
router.delete('/delete/:productId', authenticateToken, deleteProductController);

export default router;