import { ObjectId } from "mongodb";


export interface Table {
    id?: ObjectId;
    _id?: ObjectId;
    description: string;
    name: string;
    company: string;
    image?: string;
    status: boolean;
    occupied: boolean;
    createdAt: Date;
    updatedAt: Date;
}