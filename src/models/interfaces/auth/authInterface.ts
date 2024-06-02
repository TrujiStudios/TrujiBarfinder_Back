
const enum Status { 'active', 'inactive' }


export interface ICompany {
    id?: string;
    name: string;
    lastName: string;
    phone: string;
    businessName: string;
    country: string;
    businessType: string;
    email: string;
    password: string;
    status: Status | string;
    acceptTerms: boolean;
    preloadProducts: boolean;
    createdAt: Date;
    updatedAt: Date;
}