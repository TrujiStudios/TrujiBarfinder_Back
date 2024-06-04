import { Request, Response } from 'express';
import { CreateCompanyDTO, Payload } from '../../models/dtos/company/companyDTO';
import createCompanyService, { authLoginCompanyServices } from '../../services/authentication/autenticationService';
// import session from 'express-session';

declare module 'express-session' {
    interface SessionData {
        company: Payload;
        visitas: number;
        isAutehnticated: boolean;
        token: boolean;
    }
}

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
        _req.session.company = company;
        _req.session.token = true

        //visitas
        _req.session.isAutehnticated = true;
        _req.session.visitas = _req.session.visitas ? _req.session.visitas + 1 : 1;
        _req.session.save();

        return res.cookie('TrujiStudios', token, {
            httpOnly: false,
            maxAge: 1000 * 60 * 60, // 1 hora 
            secure: true, // esto debería ser true en producción
            sameSite: 'lax'
        }).status(200).json({
            message: 'Negocio logueado exitosamente',
            company: true,
            // token
        });

    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });

    }
};


export const authLogoutCompanyController = async (_req: Request, res: Response): Promise<Response> => {

    console.log("session ", _req.session.isAutehnticated);

    await _req.session.destroy((err) => { console.log(err) }); //destruir la sesión

    return res.clearCookie('TrujiStudios').status(200).json({ message: 'Negocio deslogueado exitosamente' });



    // return res.clearCookie('TrujiStudios').status(200).json({ message: 'Negocio deslogueado exitosamente' });
};
