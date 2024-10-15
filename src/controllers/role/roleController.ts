import { Request, Response } from 'express';
import { Unauthorized } from '../../utils/errors/errors';
import errorResponse from '../../utils/errors/responseError';
import { PermissionDTO } from '../../models/dtos/role/roleDTO';
import { accessModuleService, createPermissionService, createRoleService, getRoleService, updateRoleService } from '../../services/role/roleService';
import { ReleResponse } from '../../models/interfaces/role/roleInteface';

export const createRleController = async (_req: Request, res: Response): Promise<Response> => {
    const role: ReleResponse = _req.body;
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

export const createPermissionController = async (_req: Request, res: Response): Promise<Response> => {
    const role: PermissionDTO = _req.body;
    try {
        if (!_req.session.isAutehnticated) throw new Unauthorized('Session not active');
        const resultRole = await createPermissionService(role);
        return res.status(201).json(resultRole);
    } catch (error: unknown) {
        return errorResponse(res, error as Error);
    }
}

export const accessModuleController = async (_req: Request, res: Response): Promise<Response> => {
    const userId = _req.params.id;
    const company = _req.body.company;
    const module = _req.body.module;
    try {
        if (!_req.session.isAutehnticated) throw new Unauthorized('Session not active');
        const resultRole = await accessModuleService(company, userId, module);
        return res.status(201).json(resultRole);
    } catch (error: unknown) {
        return errorResponse(res, error as Error);
    }
}

export const updateRoleController = async (_req: Request, res: Response): Promise<Response> => {
    const role: ReleResponse = _req.body;
    const roleId = _req.params.roleId;
    try {
        if (!_req.session.isAutehnticated) throw new Unauthorized('Session not active');
        const resultRole = await updateRoleService(roleId, role);
        return res.status(201).json(resultRole);
    } catch (error: unknown) {
        return errorResponse(res, error as Error);
    }
}
