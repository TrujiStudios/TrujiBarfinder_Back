

import express from 'express';
import { createCompanyContoller } from '../controllers/authentication/authenticationController';

const router = express.Router();

router.post('/company', createCompanyContoller);

export default router;
