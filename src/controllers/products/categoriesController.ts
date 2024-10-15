import { Request, Response } from 'express';
import { createCategoryService, deleteCategoriesService, getCategoriesService, updateCategoriesService } from '../../services/products/categoryService';
import { CreateCategoryDTO } from '../../models/dtos/products/categoryDTO';
import { Category } from '../../models/interfaces/products/categoryInterface';
import { accessModuleService } from '../../services/role/roleService';
import { BadRequest } from '../../utils/errors/errors';


export const createCategoryController = async (_req: Request, res: Response): Promise<Response> => {
    const categoryData: CreateCategoryDTO = _req.body;
    try {
        // if (!_req.session.isAutehnticated) throw new Error('Session not active');
        const newCategory = await createCategoryService(categoryData);
        return res.status(201).json(newCategory);
    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message })
    }
}


export const getCategoriesController = async (_req: Request, res: Response): Promise<Response> => {
    const sessionUser = _req.session?.user;
    const sessionCompany = _req.session?.company;
    const companyId: string = _req.body.company;
    try {
        if (!_req.session.isAutehnticated) throw new Error('Session not active');
        console.log("Session de Categoria");
        if (sessionUser) {
            const userId = sessionUser._id;
            if (typeof userId !== 'string') throw new BadRequest('Invalid user ID');
            const module = 'category';
            const accessResponse = await accessModuleService(companyId, userId, module);
            if (!accessResponse.permissions.read) {
                throw new BadRequest('User does not have read access to this module');
            }
        }
        if (sessionCompany) {
            const companyId = sessionCompany._id;
            if (typeof companyId !== 'string') throw new BadRequest('Invalid company ID');
            const module = 'category';
            const accessResponse = await accessModuleService(companyId, companyId, module);
            if (!accessResponse.permissions.read) {
                throw new BadRequest('User does not have read access to this module');
            }
        }
        const categories = await getCategoriesService(companyId);
        return res.status(200).json(categories);
    } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message })

    }
}

export const updateCategoryController = async (_req: Request, res: Response): Promise<Response> => {
    try {
        // if (!_req.session.isAutehnticated) throw new Error('Session not active');
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
        // if (!_req.session.isAutehnticated) throw new Error('Session not active');
        const companyId: string = _req.body.company;
        const categoryId: string = _req.params.categoryId;
        const categories = await deleteCategoriesService(companyId, categoryId)
        return res.status(200).json({ message: 'Category deleted', data: categories });
    }
    catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message })
    }
}