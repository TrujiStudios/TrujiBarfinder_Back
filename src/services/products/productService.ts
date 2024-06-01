import { CreateProductDTO, ProductResponseDTO } from "../../models/dtos/products/productDTO";
import { createProductRepository } from "../../repositories/productRepository";



export const createProductService = async (productData: CreateProductDTO): Promise<ProductResponseDTO> => {

    try {

        const newProduct = await createProductRepository(productData);
        return newProduct;

    } catch (error: unknown) {
        throw new Error('Error creating company: ' + (error as Error).message);
    }
}