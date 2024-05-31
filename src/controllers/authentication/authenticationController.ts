import { Request, Response } from 'express';
import { CreateComanyDTO } from '../../dtos/companyDTO';
import createCompanyService from '../../services/authentication/autenticationService';



export const createCompanyContoller = async (req: Request, res: Response): Promise<Response> => {
    const companyData: CreateComanyDTO = req.body;

    try {
        const newCompany = await createCompanyService(companyData);
        return res.status(201).json(newCompany);
    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });
    }
};