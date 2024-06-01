import { Request, Response } from 'express';



export const getProductsController = async (_req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({ message: 'Hello World' });
}