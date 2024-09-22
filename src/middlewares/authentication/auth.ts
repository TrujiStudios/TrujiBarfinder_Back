import { ObjectId } from 'mongodb';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { findCompanyByEmailServiceFixed } from '../../services/company/companyServices';
import { environment } from '../../config/environment';
import { Payload } from '../../models/dtos/company/companyDTO';
import { Unauthorized } from '../../utils/errors/errors';
import errorResponse from '../../utils/errors/responseError';
import { findUserByEmailService } from '../../services/user/userService';



export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Formato esperado: "Bearer <token>"

        // Verificar si hay un token en las cookies o en la cabecera de autorización
        if (!req.cookies.TrujiStudios && !token) {
            throw new Unauthorized('Token not provided');
        }

        // Validar el token
        const payload = validateToken(req.cookies.TrujiStudios || token);
        if (!payload) {
            throw new Unauthorized('Invalid token');
        }

        // Verificar si la sesión está autenticada
        const authIsAuthenticated = await authSession(req.session.isAutehnticated || false);
        if (!authIsAuthenticated) throw new Unauthorized('Session not active');

        // Verificar el `companyId` del token y asignarlo al request
        req.body.company = new ObjectId(payload.sub);  // El `sub` del payload es el `companyId` o `userId`
        // req.body.company = new ObjectId(payload.company);  // El `sub` del payload es el `companyId` o `userId`

        // Si la sesión no tiene información sobre la compañía o el usuario, lanzar un error
        if (!req.session.company && !req.session.user) {
            throw new Unauthorized('Session not active');
        }

        // Verificar si los datos de sesión son válidos (para compañía o usuario)
        if (req.session.company) {
            // Verificar la sesión de la compañía
            if (!req.session.company.email || !req.session.company.password) {
                throw new Unauthorized('Session not active');
            }

            // Verificar que la sesión de la compañía esté activa
            const sessionCompany = await findCompanyByEmailServiceFixed(req.session.company.email, req.session.company.password);
            if (!sessionCompany) throw new Unauthorized('Session not active');

            // Si la sesión es válida, continuar con la siguiente función
            if (req.session.company.email === sessionCompany.email && req.session.token) {
                console.log('Sesión de compañía activa');
                next();
                return;
            }
        } else if (req.session.user) {
            // Verificar la sesión del usuario
            if (!req.session.user.email || !req.session.user.password) {
                throw new Unauthorized('Session not active');
            }

            // Verificar que la sesión del usuario esté activa (debe estar asociada a la misma compañía)
            const sessionUser = await findUserByEmailService(req.session.user.email);
            if (!sessionUser || sessionUser.company !== sessionUser.company) {
                throw new Unauthorized('Session not active');
            }

            // Si la sesión es válida, continuar con la siguiente función
            if (req.session.user.email === sessionUser.email && req.session.token) {
                console.log('Sesión de usuario activa');
                next();
                return;
            }
        }

        // Si ninguna de las sesiones es válida, lanzar un error
        throw new Unauthorized('Session not active');

    } catch (error: unknown) {
        return errorResponse(res, error as Error);
    }
};



export const validateToken = (token: string): Payload | null => {
    try {
        const decoded = jwt.verify(token, environment.jetSecret || 'defaultSecret') as JwtPayload;
        return decoded as Payload;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};


const authSession = async (isAutehnticated: boolean) => {
    if (isAutehnticated) {
        return true;
    } else {
        return false;
    }
}
