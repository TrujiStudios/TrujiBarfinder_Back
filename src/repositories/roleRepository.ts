import db from "../config/database";
import { Db } from 'mongodb';
// import { BadRequest } from "../utils/errors/errors";
import { RoleDTO, RoleResponseDTO } from "../models/dtos/role/roleDTO";
import { Role } from "../models/interfaces/role/roleInteface";

export const createRoleRepository = async (roleData: RoleDTO): Promise<RoleResponseDTO> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    // delete roleData._id;

    const collection = dbInstance.collection<Role>('roles');
    const resultRole = await collection.insertOne({
        ...roleData,
        // permissions: roleData.permissions.map(permission => ({
        //     ...permission,
        //     _id: new ObjectId()
        // })),
        createdAt: new Date(),
        updatedAt: new Date()
    });

    if (resultRole.acknowledged === false) {
        throw new Error('Role was not created');
    }

    return {
        _id: resultRole.insertedId.toString(),
        name: roleData.name,
        company: roleData.company,
        // permissions: roleData.permissions,
        createdAt: new Date(),
        updatedAt: new Date()
    };
}



export const getRoleRepository = async (
    companyId: string,
): Promise<RoleResponseDTO[]> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const roleResult = await dbInstance.collection<Role>('roles').aggregate(
        [
            {
                $match: {
                    company: companyId
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    company: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]
    ).toArray();

    return roleResult.map((role): RoleResponseDTO => ({
        _id: role._id,
        name: role.name,
        company: role.company,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt
    }));


}