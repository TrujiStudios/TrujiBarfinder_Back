import express from 'express';
import { authenticateToken } from '../middlewares/authentication/auth';
// import { createTablesSchema } from '../utils/validation/tables.Validation';
// import { validate } from '../middlewares/validate';
import { createRleController, getRoleController } from '../controllers/role/roleController';



const router = express.Router();


// cretae table
router.post('/create', authenticateToken, createRleController);

// get table
router.get('/get', authenticateToken, getRoleController);


export default router;