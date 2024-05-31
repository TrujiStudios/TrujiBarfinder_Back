import { Request, Response } from 'express';
import { CompanyResponseDTO, CreateCompanyDTO } from '../../dtos/companyDTO';
import createCompanyService, { getCompaniesService } from '../../services/authentication/autenticationService';



export const createCompanyContoller = async (req: Request, res: Response): Promise<Response> => {
    const companyData: CreateCompanyDTO = req.body;

    try {
        const newCompany = await createCompanyService(companyData);
        return res.status(201).json(newCompany);
    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });
    }
};

export const getCompaniesController = async (_req: Request, res: Response): Promise<Response<{ companies: CompanyResponseDTO[], count: number }>> => {
    try {
        const companies = await getCompaniesService();
        return res.status(200).json(companies);
    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });
    }
};