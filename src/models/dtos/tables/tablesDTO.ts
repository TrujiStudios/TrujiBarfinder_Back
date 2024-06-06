

export interface TablesDTO {
    id: string;
    description: string;
    name: string;
    company: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTablesDTO {
    id?: string;
    description: string;
    name: string;
    company: string;
    status: boolean;
}

export interface UpdateTablesDTO {
    description?: string;
    name?: string;
    status?: boolean;
}

export interface TablesResponseDTO {
    id: string;
    description: string;
    name: string;
    company: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}