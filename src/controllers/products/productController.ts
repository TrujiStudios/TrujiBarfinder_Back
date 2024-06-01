import { Request, Response } from 'express';
import { CreateProductDTO } from '../../models/dtos/products/productDTO';
import { createProductService } from '../../services/products/productService';



export const createProductController = async (_req: Request, res: Response) => {
    const productData: CreateProductDTO = _req.body;
    try {

        const newProduct = await createProductService(productData);
        return res.status(201).json(newProduct);

    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message })
    }
}