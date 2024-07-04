import express from 'express';

import { authenticateToken } from '../middlewares/authentication/auth';
import { createOrderController, getOrderController } from '../controllers/order/orderController';

const router = express.Router();


router.post('/create', authenticateToken, createOrderController)

router.get('/all', authenticateToken, getOrderController)


export default router;