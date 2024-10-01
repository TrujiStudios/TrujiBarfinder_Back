import { Request, Response } from 'express';
import { CreateProductDTO, UpdateProductDTO } from '../../models/dtos/products/productDTO';
import { createProductService, deleteProductService, getProductsService, updateProductService } from '../../services/products/productService';



export const createProductController = async (_req: Request, res: Response): Promise<Response> => {
    const productData: CreateProductDTO = _req.body;
    try {
        if (!_req.session.isAutehnticated) throw new Error('Session not active');
        const newProduct = await createProductService(productData);
        return res.status(201).json(newProduct);
    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message })
    }
}

export const getProductsController = async (_req: Request, res: Response): Promise<Response> => {

    const companyId: string = _req.body.company;
    console.log("isAutehnticated ", _req.session.isAutehnticated);
    console.log("Cookies ", _req.cookies.TrujiStudios);

    try {
        if (!_req.session.isAutehnticated) throw new Error('Session not activee');
        console.log("Modulo de Producto");
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
        if (!_req.session.isAutehnticated) throw new Error('Session not active');
        const resultsProducts = await updateProductService(companyId, productId, updatedData);
        return res.status(200).json(resultsProducts);
    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message })
    }

}

export const deleteProductController = async (_req: Request, res: Response): Promise<Response> => {

    try {
        if (!_req.session.isAutehnticated) throw new Error('Session not active');
        const companyId: string = _req.body.company;
        const productId: string = _req.params.productId;
        const resultsProducts = await deleteProductService(companyId, productId);
        return res.status(200).json({ message: 'Product deleted', data: resultsProducts });
    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message })
    }

}