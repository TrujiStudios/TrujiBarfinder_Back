import db from "../config/database";
import { Db, ObjectId } from 'mongodb';
// import { BadRequest } from "../utils/errors/errors";
import { PermissionDTO, RoleDTO, RoleResponseDTO } from "../models/dtos/role/roleDTO";
import { Permission, Role } from "../models/interfaces/role/roleInteface";

export const createRoleRepository = async (roleData: RoleDTO): Promise<RoleResponseDTO> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    // Buscar los permisos por sus IDs en la base de datos
    const permissionDocs = await dbInstance.collection<Permission>('permissions')
        .find({ _id: { $in: roleData.permissions.map(p => new ObjectId(p)) } })
        .toArray();

    // Validar que todos los permisos existen
    if (permissionDocs.length !== roleData.permissions.length) {
        throw new Error('Algunos permisos proporcionados no existen');
    }

    // Crear el nuevo rol con los permisos encontrados
    const newRole = {
        name: roleData.name,
        permissions: permissionDocs, // Asigna los permisos encontrados
        company: roleData.company,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    // Insertar el rol en la base de datos
    const collection = dbInstance.collection('roles');
    const resultRole = await collection.insertOne(newRole);

    if (resultRole.acknowledged === false) {
        throw new Error('El rol no pudo ser creado');
    }

    return {
        _id: resultRole.insertedId.toString(),
        name: roleData.name,
        company: roleData.company,
        permissions: permissionDocs.map(permission => ({
            ...permission,
            _id: permission._id.toString()
        })), // Devolvemos los permisos completos
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
                $lookup: {
                    from: 'permissions',
                    localField: 'permissions._id',
                    foreignField: '_id',
                    as: 'permissions'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    company: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    permissions: {
                        _id: 1,
                        name: 1,
                        company: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            }
        ]
    ).toArray();

    return roleResult.map((role): RoleResponseDTO => ({
        _id: role._id,
        name: role.name,
        company: role.company,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        permissions: role.permissions.map((permission: { _id: { toString: () => any; }; name: any; company: any; createdAt: any; updatedAt: any; }) => ({
            _id: permission._id.toString(),
            name: permission.name,
            company: permission.company,
            createdAt: permission.createdAt,
            updatedAt: permission.updatedAt
        }))
    }));


}

export const createPermissionRepository = async (roleData: PermissionDTO): Promise<RoleResponseDTO> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    // delete roleData._id;

    const collection = dbInstance.collection<Permission>('permissions');
    const resultRole = await collection.insertOne({
        ...roleData,
        _id: new ObjectId(roleData._id),
        createdAt: new Date(),
        updatedAt: new Date(),
        company: ""
    });

    if (resultRole.acknowledged === false) {
        throw new Error('Role was not created');
    }

    return {
        _id: resultRole.insertedId.toString(),
        name: roleData.name,
        company: "", // Add the company property
        permissions: [], // Add the permissions property
        createdAt: new Date(),
        updatedAt: new Date()
    };
}