
import express from 'express';
import { createCategoryController } from '../controllers/products/categoriesController';
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

export default router;