import { TablesResponseDTO } from "../../models/dtos/tables/tablesDTO";


export type TablesCreateTypes = {
    name: string,
    company: string,
    description: string,
    status: boolean,
    createdAt: Date,
    updatedAt: Date
}


export type TablesResponseWithMessageDTO = {
    message: string;
    data: TablesResponseDTO[];
};
