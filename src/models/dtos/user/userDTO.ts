import { ObjectId } from "mongodb";


export interface CreateUserDTO {
    id?: string;
    name: string;
    lastName: string;
    documentType: string;
    typePerson: string;
    email: string;
    password: string;
    phone: string;
    roleId: ObjectId;
    status: boolean;
}

export interface UserResponseDTO {
    id: string;
    _id: string;
    name: string;
    lastName: string;
    documentType: string;
    typePerson: string;
    email: string;
    password: string;
    phone: string;
    role: ObjectId;
    // companyId: string;
    company?: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    // eliminatedAt: Date;
}