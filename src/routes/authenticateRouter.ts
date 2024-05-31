

import express from 'express';
import { createCompanyContoller, getCompaniesController } from '../controllers/authentication/authenticationController';
import { validate } from '../middlewares/validate';
import { createCompanySchema } from '../utils/validation/companyValidation';

const router = express.Router();

//create company
router.post('/company', validate(createCompanySchema), createCompanyContoller);

//login company

//logout company

//Get company
router.get('/company', getCompaniesController);

export default router;
