import { CreateProductDTO, ProductResponseDTO } from "../models/dtos/products/productDTO";
import { Product } from "../models/interfaces/products/productInterface";
import db from "../config/database";
import { Db } from 'mongodb';


export const createProductRepository = async (categoryData: CreateProductDTO): Promise<ProductResponseDTO> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const collection = dbInstance.collection<Product>('products');
    const resultCategory = await collection.insertOne({
        ...categoryData,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    if (resultCategory.acknowledged === false) {
        throw new Error('Category was not created');
    }

    return {} as ProductResponseDTO;
}



export const getProductsRepository = async (companyId: string): Promise<ProductResponseDTO[]> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const collection = dbInstance.collection<Product>('products');
    const products = await collection.find({ companyId }).toArray();

    return products;
}
