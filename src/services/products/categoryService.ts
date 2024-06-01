import { CategoryResponseDTO, CreateCategoryDTO } from "../../models/dtos/products/categoryDTO";
import { createCategoryRepository } from "../../repositories/categoryRepository";




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

// export const getCategoriesService = async (): Promise<CategoryResponseDTO[]> =>