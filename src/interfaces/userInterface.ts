

export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
    password?: string;
}

export interface UserResponseDTO {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
