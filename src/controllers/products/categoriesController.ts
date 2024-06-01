import { Request, Response } from 'express';
import { createCategoryService } from '../../services/products/categoryService';
import { CreateCategoryDTO } from '../../models/dtos/products/categoryDTO';



export const createCategoryController = async (_req: Request, res: Response): Promise<Response> => {
    const categoryData: CreateCategoryDTO = _req.body;
    try {

        const newCategory = await createCategoryService(categoryData);
        return res.status(201).json(newCategory);

    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message })
    }
}