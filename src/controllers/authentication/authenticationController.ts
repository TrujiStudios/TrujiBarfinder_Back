import { Request, Response } from 'express';
import { CreateCompanyDTO, Payload } from '../../models/dtos/company/companyDTO';
import createCompanyService, { authLoginCompanyServices, authLoginUserServices } from '../../services/authentication/autenticationService';
// import session from 'express-session';

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

    console.log("LOGOUT </> ", _req.session.isAutehnticated);

    await _req.session.destroy((err) => { console.log(err) }); //destruir la sesión

    // Eliminar las cookies
    res.clearCookie('connect.sid');
    res.clearCookie('TrujiStudios');

    return res.status(200).json({ message: 'Negocio deslogueado exitosamente' });
};


export const authLoginController = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const loginData: Payload = _req.body;

        // Primero intentamos iniciar sesión como compañía
        try {
            const { company, token } = await authLoginCompanyServices(loginData);
            // _req.session.companyId = company._id;  // Guardamos el companyId
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
            // Si no es una compañía, intentamos como usuario
            try {
                const { user, token } = await authLoginUserServices(loginData);
                // _req.session.companyId = company._id;  // Guardamos el companyId

                _req.session.user = user;
                console.log('user', _req.session.user);
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
                // Si no es ni una compañía ni un usuario, lanzamos un error
                return res.status(400).json({ message: 'Error de autenticación: Email o contraseña inválidos' });
            }
        }
    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });
    }
};
