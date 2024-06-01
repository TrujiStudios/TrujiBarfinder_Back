import { Request, Response } from 'express';
import { createCategoryService, deleteCategoriesService, getCategoriesService, updateCategoriesService } from '../../services/products/categoryService';
import { CreateCategoryDTO } from '../../models/dtos/products/categoryDTO';
import { Category } from '../../models/interfaces/products/categoryInterface';
// import { ObjectId } from 'mongodb';



export const createCategoryController = async (_req: Request, res: Response): Promise<Response> => {
    const categoryData: CreateCategoryDTO = _req.body;
    try {

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

export const updateCategoryController = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const companyId: string = _req.body.company;
        const categoryId: string = _req.params.categoryId;
        const updatedData: Partial<Category> = _req.body;

        const categories = await updateCategoriesService(companyId, categoryId, updatedData);

        return res.status(200).json(categories);


    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message })
    }
}

export const deleteCategoryController = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const companyId: string = _req.body.company;
        const categoryId: string = _req.params.categoryId;

        const categories = await deleteCategoriesService(companyId, categoryId)
        return res.status(200).json({ message: 'Category deleted', data: categories });

    }
    catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message })
    }
}