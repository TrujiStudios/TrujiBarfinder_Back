import { Request, Response } from 'express';
import { CreateProductDTO, UpdateProductDTO } from '../../models/dtos/products/productDTO';
import { createProductService, getProductsService, updateProductService } from '../../services/products/productService';



export const createProductController = async (_req: Request, res: Response): Promise<Response> => {
    const productData: CreateProductDTO = _req.body;
    try {

        const newProduct = await createProductService(productData);
        return res.status(201).json(newProduct);

    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message })
    }
}

export const getProductsController = async (_req: Request, res: Response): Promise<Response> => {

    const companyId: string = _req.body.company;

    try {

        const products = await getProductsService(companyId);
        return res.status(200).json(products);

    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message })
    }
}



export const updateProductController = async (_req: Request, res: Response): Promise<Response> => {
    const companyId: string = _req.body.company;
    const productId: string = _req.params.productId;
    const updatedData: Partial<UpdateProductDTO> = _req.body;

    try {

        const resultsProducts = await updateProductService(companyId, productId, updatedData);
        return res.status(200).json(resultsProducts);

    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message })
    }

}