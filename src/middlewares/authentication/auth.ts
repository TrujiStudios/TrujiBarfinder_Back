import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
// import express from 'express';
import { environment } from '../../config/environment';
import { ObjectId } from 'mongodb';
// import { findCompanyByIdRepository } from '../../repositories/companyRepositories';


interface Payload {
    id: string;
    email: string;
}

// validar el token del usuario 

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato esperado: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Falta el token' });
    }

    const payload = validateToken(token);

    if (!payload) {
        return res.status(401).json({ message: 'Token inválido' });
    }

    //verificar el id del usuario 
    // const company = await findCompanyByIdRepository(payload.id);


    // console.log('Token decodificado:', company);

    // Adjuntar información del usuario al objeto de solicitud
    // req.body.company = payload.id;

    req.body.company = new ObjectId(payload.id);
    console.log('Token decodificado:', req.body.company);
    // Llamar a la siguiente función de middleware
    next();
    return; // Añade esta línea para asegurar que todas las rutas de código devuelven un valor
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


