import express from 'express';
import auth from './authenticateRouter';
import company from './companyRouter';
import product from './productRouter';
import table from './table.Router';

const router = express.Router();

// Rutas Auth
router.use('/auth', auth);

// Rutas Company
router.use('/company', company);

// Rutas Product y Category
router.use('/product', product);

// Rutas Tables
router.use('/tables', table);


export default router;