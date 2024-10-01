import express from 'express';
import { authenticateToken } from '../middlewares/authentication/auth';
// import { createTablesSchema } from '../utils/validation/tables.Validation';
// import { validate } from '../middlewares/validate';
import { createPermissionController, createRleController, getRoleController } from '../controllers/role/roleController';



const router = express.Router();


// cretae table
router.post('/create', authenticateToken, createRleController);

// get table
router.get('/get', authenticateToken, getRoleController);

// // create permission
router.post('/createPermission', authenticateToken, createPermissionController);


export default router;