import express from 'express';

import { authenticateToken } from '../middlewares/authentication/auth';
import { createUserController, findUserByController } from '../controllers/users/userController';

const router = express.Router();


router.post('/create', authenticateToken, createUserController)

//get user
router.get('/list', authenticateToken, findUserByController);

export default router;