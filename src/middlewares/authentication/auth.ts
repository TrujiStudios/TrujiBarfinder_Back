import { ObjectId } from 'mongodb';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { findCompanyByEmailServiceFixed } from '../../services/company/companyServices';
import { environment } from '../../config/environment';
import { Payload } from '../../models/dtos/company/companyDTO';
import { Unauthorized } from '../../utils/errors/errors';
import errorResponse from '../../utils/errors/responseError';



export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Formato esperado: "Bearer <token>"

        if (!req.cookies.TrujiStudios && !token) {
            throw new Unauthorized('Token not provided');
        }
        const payload = validateToken(req.cookies.TrujiStudios);

        if (!payload) {
            throw new Unauthorized('Invalid token');
        }

        const authIsAutehnticated = await authSession(req.session.isAutehnticated || false);
        if (!authIsAutehnticated) throw new Unauthorized('Session not active');
        //verificar el id del usuario 
        // const company = await findCompanyByIdRepository(payload.id);


        req.body.company = new ObjectId(payload.sub);
        console.log('Token decodificado:', req.body.company);
        console.log('isAutehnticated ', req.session.isAutehnticated);
        // console.log('cOMAPNY ', req.session.company);



        if (!req.session.company) {
            console.log('Sesión inactiva');
            throw new Unauthorized('Session not active');
        }

        if (!req.session.company.email || !req.session.company.password) {
            console.log('Sesión inactiva');
            throw new Unauthorized('Session not active');
        }

        const sessioncompany = await findCompanyByEmailServiceFixed(req.session.company.email, req.session.company.password);

        if (!sessioncompany) throw new Unauthorized('Session not active');

        if (req.session && req.session.company && req.session.company.email === sessioncompany.email && req.session.token) {
            console.log('Sesión activa');
            next();
            return;
        }
        else {
            console.log('Sesión inactiva');
            throw new Unauthorized('Session not active');
        }



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
