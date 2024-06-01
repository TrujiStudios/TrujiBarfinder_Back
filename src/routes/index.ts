import express from 'express';
import auth from './authenticateRouter';
import company from './companyRouter';
import product from './productRouter';

const router = express.Router();

// Rutas Auth
router.use('/auth', auth);

// Rutas Company
router.use('/company', company);

// Rutas Product y Category
router.use('/product', product);


export default router;