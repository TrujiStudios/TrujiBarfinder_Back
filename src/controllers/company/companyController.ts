
import { Request, Response } from 'express';
import { CompanyResponseDTO } from '../../models/dtos/company/companyDTO';
import { getCompaniesService } from '../../services/company/companyServices';




export const getCompaniesController = async (_req: Request, res: Response): Promise<Response<{ companies: CompanyResponseDTO[], count: number }>> => {
    try {
        const companies = await getCompaniesService();
        return res.status(200).json(companies);
    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });
    }
};