
import express from 'express';
import { getCompaniesController } from '../controllers/company/companyController';

const router = express.Router();



//Get company
router.get('/list', getCompaniesController);

export default router;