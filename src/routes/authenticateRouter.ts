import express from 'express';
import { createCompanyContoller } from '../controllers/authentication/authenticationController';
import { validate } from '../middlewares/validate';
import { createCompanySchema } from '../utils/validation/companyValidation';

const router = express.Router();

//create company
router.post('/company', validate(createCompanySchema), createCompanyContoller);

//login company

//logout company



export default router;
