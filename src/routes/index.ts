import express from 'express';
import auth from './authenticateRouter';
import company from './companyRouter';

const router = express.Router();

// Rutas Auth
router.use('/auth', auth);

// Rutas Company
router.use('/company', company);


export default router;