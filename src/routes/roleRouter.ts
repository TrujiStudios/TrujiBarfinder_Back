import express from 'express';
import { authenticateToken } from '../middlewares/authentication/auth';
// import { createTablesSchema } from '../utils/validation/tables.Validation';
// import { validate } from '../middlewares/validate';
import { accessModuleController, createPermissionController, createRleController, getRoleController, updateRoleController } from '../controllers/role/roleController';



const router = express.Router();


// cretae table
router.post('/create', authenticateToken, createRleController);

// get table
router.get('/get', authenticateToken, getRoleController);

//update role
router.patch('/update/:roleId', authenticateToken, updateRoleController);

// // create permission
router.post('/createPermission', authenticateToken, createPermissionController);

// verificar si se puede acceder a un modulo
router.get('/accessModule/:id', authenticateToken, accessModuleController);


export default router;