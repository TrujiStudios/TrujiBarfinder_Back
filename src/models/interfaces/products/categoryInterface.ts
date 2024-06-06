


export interface Category {
    id?: string;
    name: string;
    description: string;
    status: boolean;
    imagen: string;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
    company?: string;
    // _id?: string;
    // value: string;
}