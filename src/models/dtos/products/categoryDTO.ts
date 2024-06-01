

export interface CreateCategoryDTO {
    name: string;
    description: string;
    status: boolean;
    companyId: string;
}

export interface CategoryResponseDTO {
    id: string;
    name: string;
    description: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    companyId: string;
}