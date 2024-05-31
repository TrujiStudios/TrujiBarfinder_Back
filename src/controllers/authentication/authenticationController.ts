import { Request, Response } from 'express';
import { CreateCompanyDTO } from '../../dtos/companyDTO';
import createCompanyService from '../../services/authentication/autenticationService';



export const createCompanyContoller = async (req: Request, res: Response): Promise<Response> => {
    const companyData: CreateCompanyDTO = req.body;

    try {
        const newCompany = await createCompanyService(companyData);
        return res.status(201).json(newCompany);
    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });
    }
};

