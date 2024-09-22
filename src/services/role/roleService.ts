
import { PermissionDTO, RoleDTO, RoleResponseDTO } from '../../models/dtos/role/roleDTO';
import { createPermissionRepository, createRoleRepository, getRoleRepository } from '../../repositories/roleRepository';
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
