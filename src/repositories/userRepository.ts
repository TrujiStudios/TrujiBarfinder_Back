import { Db } from "mongodb";
import db from "../config/database";

import { CreateUserDTO, UserResponseDTO } from "../models/dtos/user/userDTO";
import { User } from "../models/interfaces/user/userInterface";

export const createUserRepository = async (userData: CreateUserDTO): Promise<UserResponseDTO> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const collection = dbInstance.collection<User>('users');
    const resultUser = await collection.insertOne({
        ...userData,
        // id: userData.id!,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    if (resultUser.acknowledged === false) {
        throw new Error('User was not created');
    }

    return {
        id: resultUser.insertedId.toString(),
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}