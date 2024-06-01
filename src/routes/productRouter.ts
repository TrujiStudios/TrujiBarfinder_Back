
import express from 'express';
import { createCategoryController, deleteCategoryController, getCategoriesController, updateCategoryController } from '../controllers/products/categoriesController';
import { validate } from '../middlewares/validate';
import { createCategorySchema } from '../utils/validation/categoryValidate';
import { authenticateToken } from '../middlewares/authentication/auth';


const router = express.Router();


//create category
router.post('/category/create',
    [
        validate(createCategorySchema)
        , authenticateToken
    ], createCategoryController);

//get categories
router.get('/category/get', authenticateToken, getCategoriesController);

//update category
router.put('/category/update/:categoryId', authenticateToken, updateCategoryController);

//delete category
router.delete('/category/delete/:categoryId', authenticateToken, deleteCategoryController);

export default router;