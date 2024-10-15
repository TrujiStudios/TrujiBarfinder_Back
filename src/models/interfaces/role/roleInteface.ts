import { ObjectId } from "mongodb";


export interface Role {
    _id?: ObjectId;
    name: string;
    permissions: Permission[];
    createdAt: Date;
    updatedAt: Date;
    // eliminatedAt: Date;
}

export interface Permission {
    _id?: ObjectId;
    name: string; // Ej: 'create_post', 'edit_post', 'delete_post'
    company: string;
    createdAt: Date;
    updatedAt: Date;
}



export interface ReleResponse {
    name: string;
    active: boolean;
    type: string;
    authorization: Authorization;
    accessTo: AccessTo[];
    description: string;
}

export interface AccessTo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export interface Authorization {
    moduleApp: ModuleApp;
    personalInformation: Category;
    order: Category;
    table: Category;
    product: Category;
    category: Category;
    users: Category;
}

export interface Category {
    accessModule: AccessModule;
    access: Access;
}

export interface Access {
    c: boolean;
    r: boolean;
    u: boolean;
    d: boolean;
}

export interface AccessModule {
    showModule: boolean;
}

export interface ModuleApp {
    accessModule: AccessModule;
}
