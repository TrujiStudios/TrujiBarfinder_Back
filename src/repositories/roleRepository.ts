import db from "../config/database";
import { Db, ObjectId } from 'mongodb';
// import { BadRequest } from "../utils/errors/errors";
import { PermissionDTO, RoleDTO, RoleResponseDTO } from "../models/dtos/role/roleDTO";
import { Permission, Role } from "../models/interfaces/role/roleInteface";
// import plantillaRolAdmin from "../utils/plantillas/rol.admin";

export const createPlantillaRolUserRepository = async (companyId: any): Promise<void> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }
    const collection = dbInstance.collection('roles');
    const result = await collection.insertMany(
        [
            {
                name: "planilla User",
                type: "User",
                defauldUser: true,
                defauldAdmin: false,
                authorization: {
                    moduleApp: {
                        accessModule: {
                            showModule: true
                        }
                    },
                    personalInformation: {
                        accessModule: {
                            showModule: true
                        },
                        access: {
                            c: true,
                            r: true,
                            u: true,
                            d: true
                        }
                    },
                    order: {
                        accessModule: {
                            showModule: true
                        },
                        access: {
                            c: true,
                            r: true,
                            u: true,
                            d: true
                        }
                    }
                },
                accessTo: [],
                company: new ObjectId(companyId),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]
    );
    if (result.acknowledged === false) {
        throw new Error('PlantillaRolAdmin was not created');
    }

    return;
};

export const createPlantillaRolAdminRepository = async (companyId: any) => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }
    const collection = dbInstance.collection('roles');
    const result = await collection.insertMany(
        [
            {
                name: "plantilla administrador",
                type: "Admin",
                defaulUser: false,
                defalultAdmin: true,
                authorization: {
                    moduleApp: {
                        accessModule: {
                            showModule: true
                        }
                    },
                    users: {
                        accessModule: {
                            showModule: true
                        },
                        access: {
                            c: true,
                            r: true,
                            u: true,
                            d: true
                        },
                        personalInformation: {
                            access: {
                                c: true,
                                r: true,
                                u: true,
                                d: true
                            }
                        }
                    },
                    roles: {
                        accessModule: {
                            showModule: true
                        },
                        access: {
                            c: true,
                            r: true,
                            u: true,
                            d: true
                        }
                    },
                    table: {
                        accessModule: {
                            showModule: true
                        },
                        access: {
                            c: true,
                            r: true,
                            u: true,
                            d: true
                        }
                    },
                    order: {
                        accessModule: {
                            showModule: true
                        },
                        access: {
                            c: true,
                            r: true,
                            u: true,
                            d: true
                        }
                    }
                },
                accessTo: [],
                company: new ObjectId(companyId),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]
    );
    if (result.acknowledged === false) {
        throw new Error('PlantillaRolAdmin was not created');
    }

    return result;
};


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

// accessModule
export const accessModuleRepository = async (company: string, userId?: string) => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }
    console.log(userId);

    // Buscar el usuario en la base de datos por el ID y el roleId
    let userResult = await dbInstance.collection('users').aggregate([
        {
            $match: {
                _id: new ObjectId(userId),
                company: new ObjectId(company),
            }
        },
        {
            $lookup: {
                from: 'roles',
                localField: 'roleId',
                foreignField: '_id',
                as: 'roles'
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                company: 1,
                createdAt: 1,
                updatedAt: 1,
                roleId: 1,
                roles: {
                    _id: 1,
                    name: 1,
                    type: 1,
                    authorization: 1,
                    company: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    permissions: 1
                }
            }
        }
    ]).toArray();

    // Si no se encuentra el usuario, buscar en la colección company
    if (userResult.length === 0) {
        userResult = await dbInstance.collection('company').aggregate([
            {
                $match: {
                    _id: new ObjectId(company),
                }
            },
            {
                $lookup: {
                    from: 'roles',
                    localField: 'roleId',
                    foreignField: '_id',
                    as: 'roles'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    roles: {
                        _id: 1,
                        name: 1,
                        type: 1,
                        authorization: 1,
                        company: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        permissions: 1
                    }
                }
            }
        ]).toArray();

        if (userResult.length === 0) {
            throw new Error('No se encontró el usuario ni la compañía');
        }
    }

    return userResult.map((role): RoleResponseDTO => ({
        _id: role._id,
        name: role.name,
        company: role.company,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        permissions: role.roles.map((permission: { _id: { toString: () => any; }; name: any; type: any, authorization: string[], company: any; createdAt: any; updatedAt: any; }) => ({
            _id: permission._id.toString(),
            name: permission.name,
            type: permission.type,
            authorization: permission.authorization,
            company: permission.company,
            createdAt: permission.createdAt,
            updatedAt: permission.updatedAt
        }))
    }))[0];
};




//ejemplo

export const accessModuleejemplo = async (company: string, userId?: string, module?: string) => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    // Buscar el usuario en la base de datos por el ID y el roleId
    let userResult = await dbInstance.collection('users').aggregate([
        {
            $match: {
                _id: new ObjectId(userId),
                company: new ObjectId(company),
            }
        },
        {
            $lookup: {
                from: 'roles',
                localField: 'roleId',
                foreignField: '_id',
                as: 'roles'
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                company: 1,
                createdAt: 1,
                updatedAt: 1,
                roleId: 1,
                roles: {
                    _id: 1,
                    name: 1,
                    type: 1,
                    authorization: 1,
                    company: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        }
    ]).toArray();

    // Si no se encuentra el usuario, buscar en la colección company
    if (userResult.length === 0) {
        userResult = await dbInstance.collection('company').aggregate([
            {
                $match: {
                    _id: new ObjectId(company),
                }
            },
            {
                $lookup: {
                    from: 'roles',
                    localField: 'roleId',
                    foreignField: '_id',
                    as: 'roles'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    roles: {
                        _id: 1,
                        name: 1,
                        type: 1,
                        authorization: 1,
                        company: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            }
        ]).toArray();

        if (userResult.length === 0) {
            throw new Error('No se encontró el usuario ni la compañía');
        }
    }

    // Filtrar los permisos del módulo específico para verificar el acceso y los permisos
    return userResult.map((role): RoleResponseDTO => ({
        _id: role._id,
        name: role.name,
        company: role.company,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        permissions: role.roles.map((permission: { _id: { toString: () => any; }; name: any; type: any, authorization: any }) => ({
            _id: permission._id.toString(),
            name: permission.name,
            type: permission.type,
            authorization: module ? permission.authorization[module] || null : null  // Obtener autorización específica del módulo
        }))
    }))[0];
};
