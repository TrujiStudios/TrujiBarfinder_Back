import { Request, Response } from 'express';
import { Unauthorized } from '../../utils/errors/errors';
import errorResponse from '../../utils/errors/responseError';
import { RoleDTO } from '../../models/dtos/role/roleDTO';
import { createRoleService, getRoleService } from '../../services/role/roleService';



export const createRleController = async (_req: Request, res: Response): Promise<Response> => {
    const role: RoleDTO = _req.body;
    try {
        if (!_req.session.isAutehnticated) throw new Unauthorized('Session not active');
        const resultRole = await createRoleService(role);
        return res.status(201).json(resultRole);
    } catch (error: unknown) {
        return errorResponse(res, error as Error);
    }
}

export const getRoleController = async (_req: Request, res: Response): Promise<Response> => {
    try {
        if (!_req.session.isAutehnticated) throw new Unauthorized('Session not active');
        const companyId: string = _req.body.company;
        const resultRole = await getRoleService(companyId);
        return res.status(200).json(resultRole);

    } catch (error: unknown) {
        return errorResponse(res, error as Error);
    }
}