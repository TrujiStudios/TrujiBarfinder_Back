
import { Request, Response } from 'express';
import { CompanyResponseDTO } from '../../models/dtos/company/companyDTO';
import { findCompanyByEmailServiceFixed, getCompaniesService } from '../../services/company/companyServices';




export const getCompaniesController = async (_req: Request, res: Response): Promise<Response<{ companies: CompanyResponseDTO[], count: number }>> => {
    try {
        if (!_req.session.isAutehnticated) throw new Error('Session not active');
        const companies = await getCompaniesService();
        return res.status(200).json(companies);
    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });
    }
};

export const findCompanyByEmailControllerFixed = async (req: Request, res: Response): Promise<Response> => {
    try {
        //body 
        const { email } = req.body;
        // const companyId: string = req.body.company;
        const password: string = req.body.password;
        if (!req.session.isAutehnticated) throw new Error('Session not active');
        const results = await findCompanyByEmailServiceFixed(email, password);
        return res.status(200).json({
            results
        });
    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });
    }
}