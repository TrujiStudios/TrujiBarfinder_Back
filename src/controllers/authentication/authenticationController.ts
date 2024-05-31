import { Request, Response } from 'express';
import { CreateCompanyDTO, Payload } from '../../dtos/companyDTO';
import createCompanyService, { authLoginCompanyServices } from '../../services/authentication/autenticationService';



export const authSignupCompanyContoller = async (req: Request, res: Response): Promise<Response> => {
    const companyData: CreateCompanyDTO = req.body;

    try {
        const newCompany = await createCompanyService(companyData);
        return res.status(201).json(newCompany);
    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });
    }
};


export const authLoginCompanyController = async (_req: Request, res: Response): Promise<Response> => {

    try {

        const companyLogin: Payload = _req.body;

        const { company, token } = await authLoginCompanyServices(companyLogin);
        return res.status(200).json({ company: company, token });

    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });

    }
};
