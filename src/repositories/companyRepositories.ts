
import { Db } from 'mongodb';
import db from '../config/database';
import { ICompany } from '../interfaces/companyInterface';


export const findCompanyByEmailRepository = async (email: string): Promise<boolean> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }
    const collection = dbInstance.collection<ICompany>('company');
    const company = await collection.findOne({ email });
    return !!company;
};




