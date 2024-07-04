import { ObjectId } from "mongodb";


export interface Order {
    id?: string;
    companyId: string;
    userId: ObjectId;
    tableId: ObjectId;
    status: string;
    total: number;
    createdAt: Date;
    updatedAt: Date;
    eliminatedAt: Date;
    products: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
}