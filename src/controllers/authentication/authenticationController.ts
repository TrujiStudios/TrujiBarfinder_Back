import { Request, Response } from 'express';
import { CreateComanyDTO } from '../../dtos/companyDTO';
import createCompanyService from '../../services/authentication/autenticationService';
// import { createCompanySchema } from '../../utils/validation/companyValidation';



export const createCompanyContoller = async (req: Request, res: Response): Promise<Response> => {
    const companyData: CreateComanyDTO = req.body;

    // const { error } = createCompanySchema.validate(companyData);
    // if (error) {
    //     return res.status(400).json({ message: error.details[0].message });
    // }

    try {
        const newCompany = await createCompanyService(companyData);
        return res.status(201).json(newCompany);
    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });
    }
};