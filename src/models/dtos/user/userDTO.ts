

export interface CreateUserDTO {
    id?: string;
    name: string;
    lastName: string;
    documentType: string;
    typePerson: string;
    email: string;
    password: string;
    phone: string;
    role: string;
    status: boolean;
}

export interface UserResponseDTO {
    id: string;
    _id: string;
    name: string;
    lastName: string;
    documentType: string;
    typePerson: string;
    email: string;
    password: string;
    phone: string;
    role: string;
    companyId: string;
    company?: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    // eliminatedAt: Date;
}