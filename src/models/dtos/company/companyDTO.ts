


export interface CreateCompanyDTO {
    name: string;
    lastName: string;
    phone: string;
    nameCompany: string;
    tipoNegocio: string;
    email: string;
    password: string;
}


export interface CompanyResponseDTO {
    id: string;
    name: string;
    lastName: string;
    phone: string;
    nameCompany: string;
    tipoNegocio: string;
    email: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
    token?: string;
    _id?: string;
}

export interface Payload {
    id: string | undefined;
    email: string;
    password?: string;
}



export interface CompanyResponseLoginDTO {
    email: string;
}