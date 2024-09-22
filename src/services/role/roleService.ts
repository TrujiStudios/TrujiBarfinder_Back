
import { RoleDTO, RoleResponseDTO } from '../../models/dtos/role/roleDTO';
import { createRoleRepository, getRoleRepository } from '../../repositories/roleRepository';
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
