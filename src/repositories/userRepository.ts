import { Db, ObjectId } from "mongodb";
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
        roleId: new ObjectId(userData.roleId),
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    if (resultUser.acknowledged === false) {
        throw new Error('User was not created');
    }

    return {
        id: resultUser.insertedId.toString(),
        _id: resultUser.insertedId.toString(),
        ...userData,
        role: {
            _id: userData.roleId.toString(),
            name: '', // Placeholder, should be populated from the role collection
            type: '', // Placeholder, should be populated from the role collection
            permissions: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

export const findUserByRepository = async (companyId: string): Promise<UserResponseDTO[]> => {

    try {

        const dbInstance: Db | null = await db;
        if (!dbInstance) {
            throw new Error('Database instance is null');
        }

        const resultsUser = await dbInstance.collection<User>('users').aggregate([
            {
                $match: {
                    company: companyId,
                }
            },
            {
                $lookup: {
                    from: 'roles',
                    localField: 'roleId',
                    foreignField: '_id',
                    as: 'role',
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    lastName: 1,
                    documentType: 1,
                    typePerson: 1,
                    email: 1,
                    phone: 1,
                    roleId: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    role: {
                        _id: 1,
                        name: 1,
                        type: 1,
                        permissions: 1,
                        createdAt: 1,
                        updatedAt: 1,
                    }
                }
            }
        ]).toArray();

        return resultsUser.map((user) => {
            const role = user.role[0];
            return {
                id: user._id.toString(),
                _id: user._id.toString(),
                name: user.name,
                lastName: user.lastName,
                documentType: user.documentType,
                typePerson: user.typePerson,
                email: user.email,
                phone: user.phone,
                roleId: user.roleId.toString(),
                status: user.status,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                role: {
                    _id: role._id?.toString(),
                    name: role.name,
                    type: role.type,
                    permissions: role.permissions,
                    createdAt: role.createdAt,
                    updatedAt: role.updatedAt,
                },
                password: user.password // Assuming password is part of the user document
            }
        });

    } catch (error: unknown) {
        throw new Error('Error getting user: ' + (error as Error).message);

    }


}