
import { PermissionDTO, RoleResponseDTO } from '../../models/dtos/role/roleDTO';
import { ReleResponse } from '../../models/interfaces/role/roleInteface';
import { accessModuleejemplo, createPermissionRepository, createRoleRepository, getRoleRepository } from '../../repositories/roleRepository';
import { BadRequest } from '../../utils/errors/errors';

export const createRoleService = async (productData: ReleResponse): Promise<ReleResponse> => {

    try {

        const newRole = await createRoleRepository(productData);
        return newRole;

    } catch (error: unknown) {
        throw new BadRequest('Error creating Role: ' + (error as Error).message);
    }
}

export const getRoleService = async (
    companyId: string,
): Promise<ReleResponse[]> => {
    const roleResult = await getRoleRepository(companyId);
    return roleResult;
}


export const createPermissionService = async (productData: PermissionDTO): Promise<RoleResponseDTO> => {

    try {
        // const permissionData: PermissionDTO = {
        //     ...productData,
        //     description: 'Default description' // Add a default description or get it from productData if available
        // };

        const newRole = await createPermissionRepository(productData);
        return newRole;

    } catch (error: unknown) {
        throw new BadRequest('Error creating Role: ' + (error as Error).message);
    }
}


// accessModule
// export const accessModuleService = async (company: string, userId: string, module: string) => {
//     try {
//         const userRole = await accessModuleRepository(company, userId);
//         if (!userRole) {
//             throw new BadRequest('User role not found');
//         }

//         // Verificar si el módulo existe en la autorización y si tiene permiso en accessModule
//         const hasAccess = userRole.permissions.some(permission => {
//             const authorization = permission.authorization as any;
//             return authorization[module]?.accessModule?.showModule === true && authorization[module]?.access.c === true && authorization[module]?.access.d === true && authorization[module]?.access.r === true && authorization[module]?.access.u === true;
//         });

//         if (!hasAccess) {
//             throw new BadRequest('User does not have access to this module');
//         }

//         return userRole;
//     } catch (error: unknown) {
//         throw new BadRequest('Error accessing module: ' + (error as Error).message);
//     }
// }


// export const accessModuleServiceLeer = async (company: string, userId: string, module: string) => {
//     try {
//         const userRole = await accessModuleejemplo(company, userId, module);
//         if (!userRole) {
//             throw new BadRequest('User role not found');
//         }

//         // Verificar si el módulo existe en la autorización y si tiene permiso en accessModule
//         const hasAccess = userRole.permissions.some(permission => {
//             const authorization = permission.authorization as any;
//             return authorization[module]?.accessModule?.showModule === true && authorization[module]?.access.r === true
//         });

//         if (!hasAccess) {
//             throw new BadRequest('User does not have access to this module');
//         }

//         return userRole;
//     } catch (error: unknown) {
//         throw new BadRequest('Error accessing module: ' + (error as Error).message);
//     }
// }


export const accessModuleService = async (company: string, userId: string, module: string) => {
    try {
        // Obtener el rol del usuario y las autorizaciones del módulo
        const userRole = await accessModuleejemplo(company, userId, module);
        if (!userRole) {
            throw new BadRequest('User role not found');
        }

        // Extraer la autorización del módulo específico
        const moduleAuthorization = userRole.permissions.find(permission => permission.authorization);

        if (!moduleAuthorization) {
            throw new BadRequest('Module not found in role authorizations');
        }

        // Verificar acceso al módulo (showModule) y permisos (CRUD)
        const { accessModule, access } = moduleAuthorization.authorization || {};

        if (!accessModule?.showModule) {
            throw new BadRequest('User does not have access to this module');
        }

        // Retornar los permisos de CRUD (create, read, update, delete)
        return {
            hasAccess: true,
            permissions: {
                create: access?.c || false,
                read: access?.r || false,
                update: access?.u || false,
                delete: access?.d || false,
            }
        };
    } catch (error: unknown) {
        throw new BadRequest('Error accessing module: ' + (error as Error).message);
    }
};


