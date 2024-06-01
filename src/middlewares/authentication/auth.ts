import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
// import express from 'express';


const SECRET_KEY = process.env.SECRET_KEY || 'default-secret-key';

interface Payload {
    id: string;
    email: string;
}

// validar el token del usuario 

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expected format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }

    const payload = validateToken(token);

    if (!payload) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    // Attach user information to the request object
    req.body.user = payload;

    next();
};


export const validateToken = (token: string): Payload | null => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
        return decoded as Payload;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};