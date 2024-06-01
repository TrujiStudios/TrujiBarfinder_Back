import { CategoryDTO, CategoryResponseDTO, CreateCategoryDTO } from "../../models/dtos/products/categoryDTO";
import { createCategoryRepository, getCategoriesRepository } from "../../repositories/categoryRepository";




export const createCategoryService = async (
    categoryData: CreateCategoryDTO
): Promise<CategoryResponseDTO> => {

    try {

        const newCategory = await createCategoryRepository(categoryData);
        return newCategory;

    } catch (error: unknown) {
        throw new Error('Error creating company: ' + (error as Error).message);
    }
};

export const getCategoriesService = async (companyId: string): Promise<CategoryDTO[]> => {


    try {

        const categories = await getCategoriesRepository(companyId);
        return categories;

    } catch (error: unknown) {
        throw new Error('Error creating company: ' + (error as Error).message);
    }
};