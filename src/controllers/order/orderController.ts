import { Request, Response } from 'express';
import { BadRequest, Unauthorized } from '../../utils/errors/errors';
import errorResponse from '../../utils/errors/responseError';
import { CreateOrderDTO } from '../../models/dtos/order/orderDTO';
import { createOrderService, getOneOrderService, getOrderService, updateOrderService } from '../../services/order/orderServices';
import { Order } from '../../models/interfaces/order/orderInterface';
import { accessModuleService } from '../../services/role/roleService';

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
    const sessionUser = _req.session?.user;
    const sessionCompany = _req.session?.company;

    try {
        if (!_req.session?.isAutehnticated) throw new Unauthorized('Session not active');

        if (sessionUser) {
            const userId = sessionUser._id;
            if (typeof userId !== 'string') throw new BadRequest('Invalid user ID');
            const module = 'order';
            const accessResponse = await accessModuleService(companyId, userId, module);
            if (!accessResponse.permissions.read) {
                throw new BadRequest('User does not have read access to this module');
            }
        }
        if (sessionCompany) {
            const companyId = sessionCompany._id;
            if (typeof companyId !== 'string') throw new BadRequest('Invalid company ID');
            const module = 'order';
            const accessResponse = await accessModuleService(companyId, companyId, module);
            if (!accessResponse.permissions.read) {
                throw new BadRequest('User does not have read access to this module');
            }
        }
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
