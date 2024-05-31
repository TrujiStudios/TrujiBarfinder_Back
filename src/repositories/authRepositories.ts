
import { CreateCompanyDTO, CompanyResponseDTO } from '../dtos/companyDTO';
import { Db } from 'mongodb';
import db from '../config/database';
import { ICompany } from '../interfaces/companyInterface';


export const createCompanyRepository = async (companyData: CreateCompanyDTO): Promise<CompanyResponseDTO> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }
    const collection = dbInstance.collection<ICompany>('company');
    const resultCompany = await collection.insertOne({
        ...companyData,
        id: '',
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    if (resultCompany.acknowledged === false) {
        throw new Error('Company was not created');
    }

    return {
        id: resultCompany.insertedId.toString(),
        name: companyData.name,
        lastName: companyData.lastName,
        phone: companyData.phone,
        nameCompany: companyData.nameCompany,
        tipoNegocio: companyData.tipoNegocio,
        email: companyData.email,
        // password: companyData.password,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};