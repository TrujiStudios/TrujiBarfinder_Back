

export interface TablesDTO {
    id: string;
    description: string;
    name: string;
    company: string;
    status: boolean;
    occupied: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTablesDTO {
    id?: string;
    description: string;
    name: string;
    company: string;
    occupied: boolean;
    status: boolean;
    image: string;
}

export interface UpdateTablesDTO {
    description?: string;
    name?: string;
    status?: boolean;
    occupied?: boolean;
}

export interface TablesResponseDTO {
    _id?: string;
    id?: string;
    description: string;
    name: string;
    company: string;
    status: boolean;
    occupied: boolean;
    createdAt: Date;
    updatedAt: Date;
}