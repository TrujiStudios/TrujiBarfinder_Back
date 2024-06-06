import { CreateTablesDTO, TablesResponseDTO } from '../../models/dtos/tables/tablesDTO';
import { createTableRepository, getAllTablesRepository } from '../../repositories/table.Repositoies';
import { BadRequest } from '../../utils/errors/errors';

export const createTableService = async (productData: CreateTablesDTO): Promise<TablesResponseDTO> => {

    try {

        const newProduct = await createTableRepository(productData);
        return newProduct;

    } catch (error: unknown) {
        throw new BadRequest('Error creating company: ' + (error as Error).message);
    }
}

export const getAllTablesService = async (companyId: string): Promise<TablesResponseDTO[]> => {
    const allTables = await getAllTablesRepository(companyId);
    return allTables;
}