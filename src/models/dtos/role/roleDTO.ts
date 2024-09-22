

export interface RoleDTO {
    // _id?: string;
    name: string;
    company: string;
    // permissions: PermissionDTO[];
}

export interface PermissionDTO {
    name: string;
    description: string;
}

export interface RoleResponseDTO {
    _id: string;
    name: string;
    company: string;
    // permissions: PermissionDTO[];
    createdAt: Date;
    updatedAt: Date;
}