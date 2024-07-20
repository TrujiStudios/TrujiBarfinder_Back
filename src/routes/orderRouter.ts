import express from 'express';

import { authenticateToken } from '../middlewares/authentication/auth';
import { createOrderController, getOrderController, updateOrderController } from '../controllers/order/orderController';

const router = express.Router();


router.post('/create', authenticateToken, createOrderController)

router.get('/all', authenticateToken, getOrderController)

router.put('/update/:orderId', authenticateToken, updateOrderController)


export default router;