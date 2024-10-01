import express from 'express';

import { authenticateToken } from '../middlewares/authentication/auth';
import { createUserController } from '../controllers/users/userController';

const router = express.Router();


router.post('/create', authenticateToken, createUserController)

export default router;