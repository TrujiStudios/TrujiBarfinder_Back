import express from 'express';
import { authLoginController, authLogoutCompanyController, authSignupCompanyContoller } from '../controllers/authentication/authenticationController';
import { validate } from '../middlewares/validate';
import { createCompanySchema } from '../utils/validation/companyValidation';

const router = express.Router();

// create company
router.post('/signup', validate(createCompanySchema), authSignupCompanyContoller);
// router.post('/signup', authSignupCompanyContoller);

//login company
router.post('/login', authLoginController);

//logout company
router.post('/logout', authLogoutCompanyController);



export default router;
