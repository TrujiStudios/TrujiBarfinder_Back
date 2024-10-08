

export interface RoleDTO {
    // _id?: string;
    name: string;
    company: string;
    permissions: string[];
}

export interface PermissionDTO {
    _id: string;
    name: string;
    // company: string;
}

export interface RoleResponseDTO {
    _id: string;
    name: string;
    company: string;
    permissions: PermissionDTO[];
    createdAt: Date;
    updatedAt: Date;
}