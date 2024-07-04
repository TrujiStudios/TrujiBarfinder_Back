
export interface User {
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
    createdAt: Date;
    updatedAt: Date;
    // eliminatedAt: Date;
}