import { Category } from "../../interfaces/products/categoryInterface";


export interface CreateProductDTO {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: Category;
    company: string;
    status: boolean;
    image: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
    companyId: string;
}

export interface ProductResponseDTO {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: Category;
    company: string;
    status: boolean;
    image: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
}