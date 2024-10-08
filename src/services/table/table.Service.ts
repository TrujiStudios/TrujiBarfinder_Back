import { CreateTablesDTO, TablesResponseDTO, UpdateTablesDTO } from '../../models/dtos/tables/tablesDTO';
import { createTableRepository, deleteTablesRepository, getAllTablesRepository, getOneTablesRepository, updateTablesRepository } from '../../repositories/table.Repositoies';
import { TablesResponseWithMessageDTO } from '../../types/tables/tables.types';
import { BadRequest } from '../../utils/errors/errors';

export const createTableService = async (productData: CreateTablesDTO): Promise<TablesResponseDTO> => {

    try {

        const newProduct = await createTableRepository(productData);
        return newProduct;

    } catch (error: unknown) {
        throw new BadRequest('Error creating company: ' + (error as Error).message);
    }
}


export const getAllTablesService = async (
    companyId: string,
): Promise<TablesResponseWithMessageDTO> => {
    const { data, message } = await getAllTablesRepository(companyId);
    return { data, message };
}


export const updateTablesServices = async (
    companyId: string,
    tableId: string,
    updateData: Partial<UpdateTablesDTO>
): Promise<TablesResponseDTO> => {
    const results = await updateTablesRepository(companyId, tableId, updateData);
    return results;
}

export const deleteTablesServices = async (
    companyId: string,
    tableId: string
): Promise<TablesResponseDTO> => {
    const results = await deleteTablesRepository(companyId, tableId);
    return results;
}


export const getOneTablesServices = async (
    companyId: string,
    tableId: string
): Promise<TablesResponseDTO> => {
    const results = await getOneTablesRepository(companyId, tableId);
    return results;
}