import { CreateProductDTO, ProductResponseDTO, UpdateProductDTO } from "../../models/dtos/products/productDTO";
import { createProductRepository, getProductsRepository, updateProductRepository } from "../../repositories/productRepository";



export const createProductService = async (productData: CreateProductDTO): Promise<ProductResponseDTO> => {

    try {

        const newProduct = await createProductRepository(productData);
        return newProduct;

    } catch (error: unknown) {
        throw new Error('Error creating company: ' + (error as Error).message);
    }
}

export const getProductsService = async (companyId: string): Promise<ProductResponseDTO[]> => {

    try {

        const products = await getProductsRepository(companyId);
        return products;

    } catch (error: unknown) {
        throw new Error('Error getting companies: ' + (error as Error).message);
    }
}


export const updateProductService = async (
    companyId: string,
    productId: string,
    updatedData: Partial<UpdateProductDTO>): Promise<ProductResponseDTO | null> => {
    try {

        const product = await updateProductRepository(companyId, productId, updatedData);
        return product;

    } catch (error: unknown) {
        throw new Error('Error creating company: ' + (error as Error).message);
    }
}