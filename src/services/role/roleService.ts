
import { PermissionDTO, RoleDTO, RoleResponseDTO } from '../../models/dtos/role/roleDTO';
import { accessModuleRepository, createPermissionRepository, createRoleRepository, getRoleRepository } from '../../repositories/roleRepository';
import { BadRequest } from '../../utils/errors/errors';

export const createRoleService = async (productData: RoleDTO): Promise<RoleResponseDTO> => {

    try {

        const newRole = await createRoleRepository(productData);
        return newRole;

    } catch (error: unknown) {
        throw new BadRequest('Error creating Role: ' + (error as Error).message);
    }
}

export const getRoleService = async (
    companyId: string,
): Promise<RoleResponseDTO[]> => {
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
export const accessModuleService = async (company: string, userId: string, module: string) => {
    try {
        const userRole = await accessModuleRepository(company, userId);
        if (!userRole) {
            throw new BadRequest('User role not found');
        }

        // Verificar si el módulo existe en la autorización y si tiene permiso en accessModule
        const hasAccess = userRole.permissions.some(permission => {
            const authorization = permission.authorization as any;
            return authorization[module]?.accessModule?.showModule === true;
        });

        if (!hasAccess) {
            throw new BadRequest('User does not have access to this module');
        }

        return userRole;
    } catch (error: unknown) {
        throw new BadRequest('Error accessing module: ' + (error as Error).message);
    }
}
