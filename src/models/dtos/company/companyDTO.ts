


export interface CreateCompanyDTO {
    name: string;
    lastName: string;
    phone: string;
    businessName: string;
    country: string;
    businessType: string;
    email: string;
    password: string;
    acceptTerms: boolean;
    preloadProducts: boolean;
}


export interface CompanyResponseDTO {
    id: string;
    name: string;
    lastName: string;
    phone: string;
    businessName: string;
    country: string;
    businessType: string;
    email: string;
    password?: string;
    acceptTerms?: boolean;
    preloadProducts?: boolean;
    createdAt: Date;
    updatedAt: Date;
    token?: string;
    _id?: string;
}

export interface Payload {
    id: string | undefined;
    _id?: string;
    email?: string;
    password?: string;
    sub?: string | undefined;
    token?: string;
    company?: string;
}



export interface CompanyResponseLoginDTO {
    email: string;
}