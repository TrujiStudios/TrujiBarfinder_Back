
import { Db } from 'mongodb';
import db from '../config/database';
import { ICompany } from '../models/interfaces/auth/authInterface';
import { CompanyResponseDTO } from '../models/dtos/company/companyDTO';
import { ObjectId } from 'mongodb'; // Add this import
// import { CompanyResponseLoginDTO } from '../dtos/companyDTO';


export const findCompanyByEmailRepository = async (email: string): Promise<boolean> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }
    const collection = dbInstance.collection<ICompany>('company');
    const company = await collection.findOne({ email });
    return !!company;
};


export const byEmailcompanyRepository = async (email: string): Promise<CompanyResponseDTO | null> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }
    const collection = dbInstance.collection<any>('company');
    const company = await collection.findOne({ email });

    if (!company) {
        throw new Error('Company does not exist');
    }

    return company;
};

export const findCompanyByIdRepository = async (companyId: string): Promise<CompanyResponseDTO | null> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }
    const collection = dbInstance.collection<ICompany>('company');
    const company = await collection.findOne({ _id: new ObjectId(companyId) }); // Convert companyId to ObjectId

    if (!company) {
        throw new Error('Company does not exist');
    }

    return {
        id: company._id.toString(),
        name: company.name,
        lastName: company.lastName,
        phone: company.phone,
        nameCompany: company.nameCompany,
        tipoNegocio: company.tipoNegocio,
        email: company.email,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt
    };
}





