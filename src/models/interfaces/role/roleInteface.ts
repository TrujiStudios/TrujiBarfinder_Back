import { ObjectId } from "mongodb";


export interface Role {
    _id?: ObjectId;
    name: string;
    // permissions: Permission[];
    createdAt: Date;
    updatedAt: Date;
    // eliminatedAt: Date;
}

export interface Permission {
    _id: ObjectId;
    name: string; // Ej: 'create_post', 'edit_post', 'delete_post'
    description: string;  // Breve descripción de lo que permite el permiso
}