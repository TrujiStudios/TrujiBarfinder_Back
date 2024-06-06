import { Request, Response } from 'express';
import { Unauthorized } from '../../utils/errors/errors';
import errorResponse from '../../utils/errors/responseError';
import { createTableService, getAllTablesService } from '../../services/table/table.Service';
import { CreateTablesDTO } from '../../models/dtos/tables/tablesDTO';

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
    try {
        if (!_req.session.isAutehnticated) throw new Unauthorized('Session not active');
        const companyId: string = _req.body.company;
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