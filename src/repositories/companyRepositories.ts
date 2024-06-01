
import { Db } from 'mongodb';
import db from '../config/database';
import { ICompany } from '../models/interfaces/auth/authInterface';
import { CompanyResponseDTO } from '../models/dtos/company/companyDTO';
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




