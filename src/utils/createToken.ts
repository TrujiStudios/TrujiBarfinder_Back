import jwt from "jsonwebtoken";
import { Payload } from "../dtos/companyDTO";






export const createToken = (payload: Payload): string => {
    return jwt.sign(payload, 'SECRET_KEY', { expiresIn: '1h' }); // El token expira en 1 hora
};
