import { Db, ObjectId } from "mongodb";
import db from "../config/database";
import { CreateTablesDTO, TablesResponseDTO, UpdateTablesDTO } from "../models/dtos/tables/tablesDTO";
import { Table } from "../models/interfaces/tables/tablesInterface";
import { BadRequest } from "../utils/errors/errors";
import { TablesResponseWithMessageDTO } from "../types/tables/tables.types";



export const createTableRepository = async (tableData: CreateTablesDTO): Promise<TablesResponseDTO> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const collection = dbInstance.collection<Table>('tables');
    const resultCategory = await collection.insertOne({
        name: tableData.name,
        company: tableData.company,
        description: tableData.description,
        status: tableData.status,
        image: tableData.image,
        occupied: tableData.occupied,
        // image: '/src/assets/images/barfinder_table_dnd.png',
        createdAt: new Date(),
        updatedAt: new Date()
    });

    if (resultCategory.acknowledged === false) {
        throw new BadRequest('Error creating table');
    }

    // return {} as TablesResponseDTO;

    return {
        id: resultCategory.insertedId.toHexString(),
        name: tableData.name,
        company: tableData.company,
        description: tableData.description,
        status: tableData.status,
        occupied: tableData.occupied,
        createdAt: new Date(),
        updatedAt: new Date()
    };

}


export const getAllTablesRepository = async (companyId: string): Promise<TablesResponseWithMessageDTO> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const resultsTable = await dbInstance.collection<Table>('tables').aggregate(
        [
            {
                $match: {
                    company: companyId,
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    // company: 1,
                    description: 1,
                    image: 1,
                    status: 1,
                    occupied: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }

        ]).toArray() as Table[];
    const countTables = await dbInstance.collection('tables').countDocuments({ company: companyId });
    console.log(countTables);

    const data: TablesResponseDTO[] = resultsTable.map((table: Table) => ({
        id: table._id ? table._id.toHexString() : '',
        name: table.name,
        company: table.company,
        description: table.description,
        image: table.image,
        occupied: table.occupied,
        status: table.status,
        createdAt: table.createdAt,
        updatedAt: table.updatedAt
    }));

    return {
        message: `Cantidad Actual: ${countTables} `,
        data
    };
}

export const updateTablesRepository = async (
    companyId: string,
    tableId: string,
    updateTable: Partial<UpdateTablesDTO>
): Promise<TablesResponseDTO> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const updateResult = await dbInstance.collection<Table>('tables').findOneAndUpdate(
        {
            _id: new ObjectId(tableId),
            company: companyId
        },
        {
            $set: {
                ...updateTable,
                updatedAt: new Date()

            },
        },
        {
            returnDocument: 'after'
        }
    );

    if (!updateResult) {
        throw new Error('Update result is null');
    }

    // return {} as TablesResponseDTO;
    return {
        _id: updateResult._id.toHexString(),
        name: updateResult.name,
        company: updateResult.company,
        description: updateResult.description,
        occupied: updateResult.occupied,
        status: updateResult.status,
        createdAt: updateResult.createdAt,
        updatedAt: updateResult.updatedAt
    };
}

export const deleteTablesRepository = async (companyId: string, tableId: string): Promise<TablesResponseDTO> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const deleteResult = await dbInstance.collection<Table>('tables').deleteOne(
        {
            _id: new ObjectId(tableId),
            company: companyId
        }
    );

    if (deleteResult.deletedCount === 0) {
        throw new BadRequest('Table not found');
    }

    // return {} as TablesResponseDTO;
    return deleteResult.deletedCount as unknown as TablesResponseDTO;
}


export const getOneTablesRepository = async (companyId: string, tableId: string): Promise<TablesResponseDTO> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const resultTable = await dbInstance.collection<Table>('tables').findOne(
        {
            _id: new ObjectId(tableId),
            company: companyId
        }
    );

    if (!resultTable) {
        throw new BadRequest('Table not found');
    }

    // return {} as TablesResponseDTO;
    return {
        _id: resultTable._id.toHexString(),
        name: resultTable.name,
        company: resultTable.company,
        description: resultTable.description,
        occupied: resultTable.occupied,
        status: resultTable.status,
        createdAt: resultTable.createdAt,
        updatedAt: resultTable.updatedAt
    };
}