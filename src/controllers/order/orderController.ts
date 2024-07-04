import { Request, Response } from 'express';
import { Unauthorized } from '../../utils/errors/errors';
import errorResponse from '../../utils/errors/responseError';
import { CreateOrderDTO } from '../../models/dtos/order/orderDTO';
import { createOrderService, getOrderService } from '../../services/order/orderServices';


export const createOrderController = async (_req: Request, res: Response): Promise<Response> => {
    const tableData: CreateOrderDTO = _req.body;
    try {
        if (!_req.session.isAutehnticated) throw new Unauthorized('Session not active');
        const resultTable = await createOrderService(tableData);
        return res.status(201).json(resultTable);
    } catch (error: unknown) {
        return errorResponse(res, error as Error);
    }
}

export const getOrderController = async (_req: Request, res: Response): Promise<Response> => {

    const companyId: string = _req.body.company;

    try {
        if (!_req.session.isAutehnticated) throw new Unauthorized('Session not active');
        const resultTable = await getOrderService(companyId);
        return res.status(200).json(resultTable);
    } catch (error: unknown) {
        return errorResponse(res, error as Error);
    }
}