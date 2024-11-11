import { Request, Response } from 'express';
import { BadRequest, Unauthorized } from '../../utils/errors/errors';
import errorResponse from '../../utils/errors/responseError';
import { createUserService, findUserByService } from '../../services/user/userService';
import { CreateUserDTO } from '../../models/dtos/user/userDTO';
import { accessModuleService } from '../../services/role/roleService';


export const createUserController = async (_req: Request, res: Response): Promise<Response> => {
    const tableData: CreateUserDTO = _req.body;
    const companyId: string = _req.body.company;
    const sessionUser = _req.session?.user;
    const sessionCompany = _req.session?.company;
    try {
        if (!_req.session?.isAutehnticated) throw new Unauthorized('Session not active');

        if (sessionUser) {
            const userId = sessionUser._id;
            if (typeof userId !== 'string') throw new BadRequest('Invalid user ID');
            const module = 'users';
            const accessResponse = await accessModuleService(companyId, userId, module);
            if (!accessResponse.permissions.create) {
                throw new BadRequest('User does not have read access to this module');
            }
        }
        if (sessionCompany) {
            const companyId = sessionCompany._id;
            if (typeof companyId !== 'string') throw new BadRequest('Invalid company ID');
            const module = 'users';
            const accessResponse = await accessModuleService(companyId, companyId, module);
            if (!accessResponse.permissions.create) {
                throw new BadRequest('User does not have read access to this module');
            }
        }
        const resultTable = await createUserService(tableData);
        return res.status(201).json(resultTable);
    } catch (error: unknown) {
        return errorResponse(res, error as Error);
    }
}

//get user
export const findUserByController = async (_req: Request, res: Response): Promise<Response> => {
    const companyId: string = _req.body.company;
    const sessionUser = _req.session?.user;
    const sessionCompany = _req.session?.company;

    try {
        if (!_req.session?.isAutehnticated) throw new Unauthorized('Session not active');

        if (sessionUser) {
            const userId = sessionUser._id;
            if (typeof userId !== 'string') throw new BadRequest('Invalid user ID');
            const module = 'users';
            const accessResponse = await accessModuleService(companyId, userId, module);
            if (!accessResponse.permissions.read) {
                throw new BadRequest('User does not have read access to this module');
            }
        }
        if (sessionCompany) {
            const companyId = sessionCompany._id;
            if (typeof companyId !== 'string') throw new BadRequest('Invalid company ID');
            const module = 'users';
            const accessResponse = await accessModuleService(companyId, companyId, module);
            if (!accessResponse.permissions.read) {
                throw new BadRequest('User does not have read access to this module');
            }
        }
        const resultsUser = await findUserByService(companyId);
        return res.status(200).json(resultsUser);
    } catch (error: unknown) {
        return errorResponse(res, error as Error);
    }
}
