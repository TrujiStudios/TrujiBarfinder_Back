import { CreateProductDTO, ProductResponseDTO } from "../../models/dtos/products/productDTO";
import { createProductRepository, getProductsRepository } from "../../repositories/productRepository";



export const createProductService = async (productData: CreateProductDTO): Promise<ProductResponseDTO> => {

    try {

        const newProduct = await createProductRepository(productData);
        return newProduct;

    } catch (error: unknown) {
        throw new Error('Error creating company: ' + (error as Error).message);
    }
}

export const getProductsService = async ({ companyId }: CreateProductDTO): Promise<ProductResponseDTO[]> => {

    try {

        const products = await getProductsRepository(companyId);
        return products;

    } catch (error: unknown) {
        throw new Error('Error getting companies: ' + (error as Error).message);
    }
}