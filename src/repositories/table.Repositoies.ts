import { Db } from "mongodb";
import db from "../config/database";
import { CreateTablesDTO, TablesResponseDTO } from "../models/dtos/tables/tablesDTO";
import { Table } from "../models/interfaces/tables/tablesInterface";
import { BadRequest, NotFound } from "../utils/errors/errors";



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
        createdAt: new Date(),
        updatedAt: new Date()
    };

}


export const getAllTablesRepository = async (companyId: string): Promise<TablesResponseDTO[]> => {
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
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }

        ]).toArray();
    const countTables = await dbInstance.collection('tables').countDocuments({ company: companyId });
    console.log(countTables);

    if ((await resultsTable).length === 0 || !resultsTable) {
        throw new NotFound('Error getting tables');
    }

    //count the number of tables
    // return {} as TablesResponseDTO[];

    return (await resultsTable as Table[]).map((table: Table) => {
        countTables;
        return {
            id: table._id ? table._id.toHexString() : '',
            name: table.name,
            company: table.company,
            description: table.description,
            status: table.status,
            createdAt: table.createdAt,
            updatedAt: table.updatedAt
        }
    });


}