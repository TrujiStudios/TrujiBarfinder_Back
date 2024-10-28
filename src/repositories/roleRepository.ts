import db from "../config/database";
import { Db, ObjectId } from 'mongodb';
import { PermissionDTO, RoleResponseDTO } from "../models/dtos/role/roleDTO";
import { Permission, ReleResponse } from "../models/interfaces/role/roleInteface";

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
                            d: false
                        }
                    },
                    table: {
                        accessModule: {
                            showModule: true
                        },
                        access: {
                            c: false,
                            r: true,
                            u: false,
                            d: false
                        }
                    },
                    product: {
                        accessModule: {
                            showModule: true
                        },
                        access: {
                            c: false,
                            r: true,
                            u: false,
                            d: false
                        }
                    },
                    category: {
                        accessModule: {
                            showModule: true
                        },
                        access: {
                            c: false,
                            r: true,
                            u: false,
                            d: false
                        }
                    },
                    users: {
                        accessModule: {
                            showModule: true
                        },
                        access: {
                            c: false,
                            r: true,
                            u: false,
                            d: false
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
                    },
                    product: {
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
                    category: {
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


export const createRoleRepository = async (roleData: ReleResponse): Promise<ReleResponse> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const collection = dbInstance.collection('roles');
    const resultRole = await collection.insertOne(roleData);

    if (resultRole.acknowledged === false) {
        throw new Error('El rol no pudo ser creado');
    }

    return {
        name: roleData.name,
        active: true,
        type: roleData.type,
        authorization: roleData.authorization,
        accessTo: roleData.accessTo,
        description: roleData.description
    };
}


export const updateRoleRepository = async (roleId: string, roleData: ReleResponse): Promise<ReleResponse> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }


    const collection = dbInstance.collection('roles');
    const resultRole = await collection.updateOne(
        { _id: new ObjectId(roleId) },
        {
            $set: {
                name: roleData.name,
                active: roleData.active,
                type: roleData.type,
                authorization: roleData.authorization,
                accessTo: roleData.accessTo,
                description: roleData.description,
                updatedAt: new Date()
            }
        }
    );

    if (resultRole.modifiedCount !== 1) {
        throw new Error('Role was not updated');
    }

    return {
        name: roleData.name,
        active: roleData.active,
        type: roleData.type,
        authorization: roleData.authorization,
        accessTo: roleData.accessTo,
        description: roleData.description
    };
}


export const getRoleRepository = async (
    companyId: string,
): Promise<ReleResponse[]> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const roleResult = await dbInstance.collection<ReleResponse>('roles').aggregate(
        [
            {
                $match: {
                    company: new ObjectId(companyId)
                }
            },
            {
                $project: {
                    name: 1,
                    active: 1,
                    type: 1,
                    authorization: 1,
                    accessTo: 1,
                    description: 1
                }
            }
        ]
    ).toArray();

    return roleResult.map((role): ReleResponse => ({
        name: role.name,
        active: role.active,
        type: role.type,
        authorization: role.authorization,
        accessTo: role.accessTo,
        description: role.description
    }));



}

export const createPermissionRepository = async (roleData: PermissionDTO): Promise<RoleResponseDTO> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

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
        company: "", 
        permissions: [], 
        createdAt: new Date(),
        updatedAt: new Date()
    };
}

export const accessModuleRepository = async (company: string, userId?: string) => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }
    console.log(userId);

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

export const accessModuleejemplo = async (company: string, userId?: string, module?: string) => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

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
            authorization: module ? permission.authorization[module] || null : null  
        }))
    }))[0];
};
