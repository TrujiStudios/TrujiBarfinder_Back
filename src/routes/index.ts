import express from 'express';
import auth from './authenticateRouter';
import company from './companyRouter';
import product from './productRouter';
import table from './table.Router';
import order from './orderRouter';

const router = express.Router();

// Rutas Auth
router.use('/auth', auth);

// Rutas Company
router.use('/company', company);

// Rutas Product y Category
router.use('/product', product);

// Rutas Tables
router.use('/tables', table);

// Rutas Orders
router.use('/orders', order);


export default router;