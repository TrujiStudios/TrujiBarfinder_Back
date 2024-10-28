import { Request, Response } from 'express';
import { CreateCompanyDTO, Payload } from '../../models/dtos/company/companyDTO';
import createCompanyService, { authLoginCompanyServices, authLoginUserServices } from '../../services/authentication/autenticationService';

declare module 'express-session' {
    interface SessionData {
        company: Payload;
        visitas: number;
        isAutehnticated: boolean;
        token: boolean;
        user?: Payload; // Add the user property
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
        });

    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });

    }
};


export const authLogoutCompanyController = async (_req: Request, res: Response): Promise<Response> => {

    await _req.session.destroy((err) => { console.log(err) }); //destruir la sesión

    res.clearCookie('connect.sid');
    res.clearCookie('TrujiStudios');

    return res.status(200).json({ message: 'Negocio deslogueado exitosamente' });
};


export const authLoginController = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const loginData: Payload = _req.body;

        try {
            const { company, token } = await authLoginCompanyServices(loginData);
            _req.session.company = company;
            _req.session.token = true;
            _req.session.isAutehnticated = true;
            _req.session.visitas = _req.session.visitas ? _req.session.visitas + 1 : 1;
            _req.session.save();

            return res.cookie('TrujiStudios', token, {
                httpOnly: false,
                maxAge: 1000 * 60 * 60, // 1 hora
                secure: true,
                sameSite: 'lax'
            }).status(200).json({
                message: 'Negocio logueado exitosamente',
                company: true,
            });
        } catch (companyError) {
            try {
                const { user, token } = await authLoginUserServices(loginData);

                _req.session.user = user;
                _req.session.token = true;
                _req.session.isAutehnticated = true;
                _req.session.visitas = _req.session.visitas ? _req.session.visitas + 1 : 1;
                _req.session.save();

                return res.cookie('TrujiStudios', token, {
                    httpOnly: false,
                    maxAge: 1000 * 60 * 60, // 1 hora
                    secure: true,
                    sameSite: 'lax'
                }).status(200).json({
                    message: 'Usuario logueado exitosamente',
                    user: true,
                });
            } catch (userError) {
                return res.status(400).json({ message: 'Error de autenticación: Email o contraseña inválidos' });
            }
        }
    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });
    }
};
