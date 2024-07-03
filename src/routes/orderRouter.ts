import express from 'express';

import { authenticateToken } from '../middlewares/authentication/auth';
import { createOrderController } from '../controllers/order/orderController';

const router = express.Router();


router.post('/create', authenticateToken, createOrderController)


export default router;