import { Request, Response } from 'express';
import { Unauthorized } from '../../utils/errors/errors';
import errorResponse from '../../utils/errors/responseError';
import { CreateOrderDTO } from '../../models/dtos/order/orderDTO';
import { createOrderService } from '../../services/order/orderServices';


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