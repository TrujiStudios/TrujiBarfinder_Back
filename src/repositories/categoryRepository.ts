import { Db } from "mongodb";
import { CategoryDTO, CategoryResponseDTO, CreateCategoryDTO } from "../models/dtos/products/categoryDTO";
import db from "../config/database";
import { Category } from "../models/interfaces/products/categoryInterface";




export const createCategoryRepository = async (categoryData: CreateCategoryDTO): Promise<CategoryResponseDTO> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const collection = dbInstance.collection<Category>('categories');
    const resultCategory = await collection.insertOne({
        ...categoryData,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    if (resultCategory.acknowledged === false) {
        throw new Error('Category was not created');
    }

    return {
        id: resultCategory.insertedId.toString(),
        name: categoryData.name,
        description: categoryData.description,
        status: categoryData.status,
        company: categoryData.comapany,
        companyId: categoryData.companyId,
        createdAt: new Date(),
        updatedAt: new Date()
    };
}

export const getCategoriesRepository = async (companyId: string): Promise<CategoryDTO[]> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const resultsCategies = dbInstance.collection<Category>('categories').aggregate([
        {
            $match: { company: companyId }
        },
        {
            $project: {
                name: 1,
                description: 1,
                status: 1
            }
        }
    ]).toArray();

    return (await resultsCategies).map((category) => {
        return {
            name: category.name,
            description: category.description,
            status: category.status
        };
    });

}
