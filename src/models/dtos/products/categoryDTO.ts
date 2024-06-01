

export interface CreateCategoryDTO {
    name: string;
    description: string;
    status: boolean;
    companyId: string;
    comapany: string;
}

export interface CategoryResponseDTO {
    id: string;
    name: string;
    description: string;
    status: boolean;
    company: string;
    createdAt: Date;
    updatedAt: Date;
    companyId: string;
}


export interface CategoryDTO {
    name: string;
    description: string;
    status: boolean;
}