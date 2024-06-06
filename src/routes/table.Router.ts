import express from 'express';
import { authenticateToken } from '../middlewares/authentication/auth';
import { createTablesController, getAllTablesController } from '../controllers/Tables/tablesController';
import { createTablesSchema } from '../utils/validation/tables.Validation';
import { validate } from '../middlewares/validate';



const router = express.Router();


// cretae table
router.post('/create',
    [
        validate(createTablesSchema),
        authenticateToken,
    ], createTablesController);

// get all tables
router.get('/all', authenticateToken, getAllTablesController);

export default router;