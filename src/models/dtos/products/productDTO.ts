// import { Category } from "../../interfaces/products/categoryInterface";


export interface CreateProductDTO {
    _id?: string;
    id?: string;
    name: string;
    description: string;
    price: number;
    category: string;
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
    category: string;
    company: string;
    status: boolean;
    image: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateProductDTO {
    _id?: string;
    name: string;
    description: string;
    price: number;
    category: string;
    company: string;
    status: boolean;
    image: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
    companyId: string;
}