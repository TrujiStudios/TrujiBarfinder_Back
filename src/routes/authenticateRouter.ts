import express from 'express';
import { authLoginCompanyController, authSignupCompanyContoller } from '../controllers/authentication/authenticationController';
import { validate } from '../middlewares/validate';
import { createCompanySchema } from '../utils/validation/companyValidation';

const router = express.Router();

// create company
router.post('/signup', validate(createCompanySchema), authSignupCompanyContoller);

//login company
router.post('/login', authLoginCompanyController);

//logout company



export default router;
