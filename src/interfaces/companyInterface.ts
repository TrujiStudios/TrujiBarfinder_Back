
const enum Status { 'active', 'inactive' }


export interface ICompany {
    id?: string;
    name: string;
    lastName: string;
    phone: string;
    nameCompany: string;
    tipoNegocio: string;
    email: string;
    password: string;
    status: Status | string;
    createdAt: Date;
    updatedAt: Date;
}