import { Request, Response } from 'express';
import { Unauthorized } from '../../utils/errors/errors';
import errorResponse from '../../utils/errors/responseError';
import { createUserService } from '../../services/user/userService';
import { CreateUserDTO } from '../../models/dtos/user/userDTO';


export const createUserController = async (_req: Request, res: Response): Promise<Response> => {
    const tableData: CreateUserDTO = _req.body;
    try {
        if (!_req.session.isAutehnticated) throw new Unauthorized('Session not active');
        const resultTable = await createUserService(tableData);
        return res.status(201).json(resultTable);
    } catch (error: unknown) {
        return errorResponse(res, error as Error);
    }
}
