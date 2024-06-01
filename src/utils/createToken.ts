import jwt from "jsonwebtoken";
import { Payload } from "../models/dtos/company/companyDTO";






export const createToken = (payload: Payload): string => {
    return jwt.sign(payload, 'SECRET_KEY', { expiresIn: '1h' }); // El token expira en 1 hora
};
