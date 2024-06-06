import { Db, ObjectId } from 'mongodb';
import { CategoryDTO, CategoryResponseDTO, CreateCategoryDTO } from "../models/dtos/products/categoryDTO";
import db from "../config/database";
import { Category } from "../models/interfaces/products/categoryInterface";



export const createCategoryRepository = async (categoryData: CreateCategoryDTO): Promise<CategoryResponseDTO> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }
    delete categoryData.id;
    const collection = dbInstance.collection<Category>('categories');
    const resultCategory = await collection.insertOne({
        ...categoryData,
        // status: true,
        imagen: 'https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png',
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
        company: categoryData.company,
        imagen: categoryData.imagen,
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
                id: 1,
                name: 1,
                description: 1,
                imagen: 1,
                status: 1
            }
        }
    ]).toArray();

    return (await resultsCategies).map((category) => {
        return {
            id: category._id.toString(),
            name: category.name,
            description: category.description,
            imagen: category.imagen,
            status: category.status
        };
    });

}

export const updateCategoriesRepository = async (
    companyId: string,
    categoryId: string,
    updatedData: Partial<Category>): Promise<Category | null> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }


    const result = await dbInstance.collection<Category>('categories').findOneAndUpdate(
        {
            _id: new ObjectId(categoryId),
            company: companyId
        },
        {
            $set: updatedData
        },
        {
            // returnDocument: 'before'
            returnDocument: 'after'
        }
    )

    if (!result) {
        throw new Error('Category not found');
    }

    return result
};


export const deleteCategoriesRepository = async (
    companyId: string,
    categoryId: string): Promise<boolean> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const result = await dbInstance.collection<Category>('categories').deleteOne({
        _id: new ObjectId(categoryId),
        company: companyId
    });

    if (result.deletedCount === 0) {
        throw new Error('Category not found');
    }

    return true;
}