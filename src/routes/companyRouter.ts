
import express from 'express';
import { findCompanyByEmailControllerFixed, getCompaniesController } from '../controllers/company/companyController';
import { authenticateToken } from '../middlewares/authentication/auth';

const router = express.Router();



//Get company
router.get('/list', getCompaniesController);

//getOne company
router.get('/listOne', authenticateToken, findCompanyByEmailControllerFixed);

export default router;