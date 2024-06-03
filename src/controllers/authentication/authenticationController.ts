import { Request, Response } from 'express';
import { CreateCompanyDTO, Payload } from '../../models/dtos/company/companyDTO';
import createCompanyService, { authLoginCompanyServices } from '../../services/authentication/autenticationService';



export const authSignupCompanyContoller = async (req: Request, res: Response): Promise<Response> => {
    const companyData: CreateCompanyDTO = req.body;

    try {
        const newCompany = await createCompanyService(companyData);
        return res.status(201).json({
            message: 'Negocio creado exitosamente',
            newCompany
        });
    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });
    }
};


export const authLoginCompanyController = async (_req: Request, res: Response): Promise<Response> => {

    try {

        const companyLogin: Payload = _req.body;

        const { company, token } = await authLoginCompanyServices(companyLogin);

        return res.cookie('token', token, {
            httpOnly: true,
            //Que expire en una hora
            expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hora
            // expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 semana
            secure: false, // esto debería ser true en producción
        }).status(200).json({
            message: 'Negocio logueado exitosamente',
            company: company,
            token
        });

    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });

    }
};
