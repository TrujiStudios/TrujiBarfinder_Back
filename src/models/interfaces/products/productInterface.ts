import { ObjectId } from "mongodb";
// import { Category } from "./categoryInterface";


export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: ObjectId;
    company: string;
    status: boolean;
    image: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
}