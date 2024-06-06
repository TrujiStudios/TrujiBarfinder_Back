import jwt from "jsonwebtoken";
import { Payload } from "../models/dtos/company/companyDTO";
import { environment } from "../config/environment";





export const createToken = (payload: Payload): string => {
    return jwt.sign(payload, environment.jetSecret || 'defaultSecret', { expiresIn: '1h' }); // El token expira en 1 hora
};
