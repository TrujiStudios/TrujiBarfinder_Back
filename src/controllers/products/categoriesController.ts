import { Request, Response } from 'express';
import { createCategoryService, getCategoriesService } from '../../services/products/categoryService';
import { CreateCategoryDTO } from '../../models/dtos/products/categoryDTO';



export const createCategoryController = async (_req: Request, res: Response): Promise<Response> => {
    const categoryData: CreateCategoryDTO = _req.body;
    try {
        const companyId: string = _req.body.company;

        console.log('Usuario autenticado:', companyId);

        const newCategory = await createCategoryService(categoryData);
        return res.status(201).json(newCategory);

    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message })
    }
}


export const getCategoriesController = async (_req: Request, res: Response): Promise<Response> => {

    try {

        const companyId: string = _req.body.company;

        const categories = await getCategoriesService(companyId);

        return res.status(200).json(categories);


    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message })

    }
}