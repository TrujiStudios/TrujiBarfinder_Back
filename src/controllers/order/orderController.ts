import { Request, Response } from 'express';
import { Unauthorized } from '../../utils/errors/errors';
import errorResponse from '../../utils/errors/responseError';
import { CreateOrderDTO } from '../../models/dtos/order/orderDTO';
import { createOrderService, getOneOrderService, getOrderService, updateOrderService } from '../../services/order/orderServices';
import { Order } from '../../models/interfaces/order/orderInterface';


export const createOrderController = async (_req: Request, res: Response): Promise<Response> => {
    const tableData: CreateOrderDTO = _req.body;
    try {
        if (!_req.session.isAutehnticated) throw new Unauthorized('Session not active');
        console.log("CREATE ORDER");
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

export const getOneOrderController = async (_req: Request, res: Response): Promise<Response> => {

    const companyId: string = _req.body.company;

    try {
        if (!_req.session.isAutehnticated) throw new Unauthorized('Session not active');
        const orderId: string = _req.params.orderId;
        const resultTable = await getOneOrderService(companyId, orderId);
        return res.status(200).json(resultTable);
    } catch (error: unknown) {
        return errorResponse(res, error as Error);
    }
}

export const updateOrderController = async (_req: Request, res: Response): Promise<Response> => {
    try {
        if (!_req.session.isAutehnticated) throw new Unauthorized('Session not active');
        const companyId: string = _req.body.company;
        const orderId: string = _req.params.orderId;
        const updatedData: Partial<Order> = _req.body;
        const resultTable = await updateOrderService(companyId, orderId, updatedData);
        return res.status(200).json(resultTable);

    } catch (error: unknown) {
        return errorResponse(res, error as Error);
    }
}