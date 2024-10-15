import { Request, Response } from 'express';
import { BadRequest, Unauthorized } from '../../utils/errors/errors';
import errorResponse from '../../utils/errors/responseError';
import { createTableService, deleteTablesServices, getAllTablesService, getOneTablesServices, updateTablesServices } from '../../services/table/table.Service';
import { CreateTablesDTO, UpdateTablesDTO } from '../../models/dtos/tables/tablesDTO';
import { accessModuleService } from '../../services/role/roleService';

export const createTablesController = async (_req: Request, res: Response): Promise<Response> => {
    const tableData: CreateTablesDTO = _req.body;
    try {
        if (!_req.session.isAutehnticated) throw new Unauthorized('Session not active');
        const resultTable = await createTableService(tableData);
        return res.status(201).json(resultTable);
    } catch (error: unknown) {
        return errorResponse(res, error as Error);
    }
}

export const getAllTablesController = async (_req: Request, res: Response): Promise<Response> => {
    const sessionUser = _req.session?.user;
    const sessionCompany = _req.session?.company;
    try {
        if (!_req.session.isAutehnticated) throw new Unauthorized('Session not active');
        const companyId: string = _req.body.company;
        if (sessionUser) {
            const userId = sessionUser._id;
            if (typeof userId !== 'string') throw new BadRequest('Invalid user ID');
            const module = 'table';
            const accessResponse = await accessModuleService(companyId, userId, module);
            if (!accessResponse.permissions.read) {
                throw new BadRequest('User does not have read access to this module');
            }
        }
        if (sessionCompany) {
            const companyId = sessionCompany._id;
            if (typeof companyId !== 'string') throw new BadRequest('Invalid company ID');
            const module = 'table';
            const accessResponse = await accessModuleService(companyId, companyId, module);
            if (!accessResponse.permissions.read) {
                throw new BadRequest('User does not have read access to this module');
            }
        }
        const { data, message } = await getAllTablesService(companyId);
        return res.status(200).json({
            msg: 'All tables',
            message,
            data
        });
    } catch (error: unknown) {
        return errorResponse(res, error as Error);
    }
}


export const updateTablesController = async (_req: Request, res: Response): Promise<Response> => {
    try {
        if (!_req.session.isAutehnticated) throw new Unauthorized('Session not active');
        const companyId: string = _req.body.company;
        const tableId: string = _req.params.tableId;
        const updatedData: Partial<UpdateTablesDTO> = _req.body;
        const results = await updateTablesServices(companyId, tableId, updatedData);
        return res.status(200).json({
            msg: 'All tables',
            data: results
        });
    } catch (error: unknown) {
        return errorResponse(res, error as Error);
    }
}

export const deleteTablesController = async (_req: Request, res: Response): Promise<Response> => {
    try {
        if (!_req.session.isAutehnticated) throw new Unauthorized('Session not active');
        const companyId: string = _req.body.company;
        const tableId: string = _req.params.tableId;
        const results = await deleteTablesServices(companyId, tableId);
        return res.status(200).json({
            message: true,
            results
        });
    } catch (error: unknown) {
        return errorResponse(res, error as Error);
    }
}

export const getOneTablesController = async (_req: Request, res: Response): Promise<Response> => {
    try {
        if (!_req.session.isAutehnticated) throw new Unauthorized('Session not active');
        const companyId: string = _req.body.company;
        const tableId: string = _req.params.tableId;
        const results = await getOneTablesServices(companyId, tableId);
        return res.status(200).json({
            message: true,
            results
        });
    } catch (error: unknown) {
        return errorResponse(res, error as Error);
    }
}
