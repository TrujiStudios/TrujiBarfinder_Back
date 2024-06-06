

export interface CreateCategoryDTO {
    id?: string;
    name: string;
    description: string;
    imagen: string;
    status: boolean;
    companyId: string;
    company: string;
}

export interface CategoryResponseDTO {
    id: string;
    name: string;
    description: string;
    status: boolean;
    company: string;
    imagen: string;
    createdAt: Date;
    updatedAt: Date;
    companyId: string;
}


export interface CategoryDTO {
    name?: string;
    description?: string;
    status?: boolean;
}

