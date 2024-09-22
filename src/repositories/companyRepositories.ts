
import { Db } from 'mongodb';
import db from '../config/database';
import { ICompany } from '../models/interfaces/auth/authInterface';
import { CompanyResponseDTO } from '../models/dtos/company/companyDTO';
import { ObjectId } from 'mongodb'; // Add this import
import { UserResponseDTO } from '../models/dtos/user/userDTO';
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

export const byEmailUserRepository = async (email: string): Promise<UserResponseDTO | null> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }
    const collection = dbInstance.collection<any>('users');
    const user = await collection.findOne({ email });

    if (!user) {
        throw new Error('User does not exist');
    }

    return user;
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
        businessName: company.businessName,
        country: company.country,
        businessType: company.businessType,
        email: company.email,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt
    };
}

// buscar compañia por email 


export const findCompanyByEmailRepositoryFixed = async (email: string): Promise<CompanyResponseDTO | null> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }
    const collection = dbInstance.collection<ICompany>('company');
    const results = await collection.aggregate([
        {
            $match: {
                // _id: new ObjectId(company),
                email: email
            }
        },
        {
            $project:
            {
                _id: 1,
                name: 1,
                email: 1,
                password: 1
            }
        }
    ]).toArray();

    if (!results) {
        throw new Error('Company does not exist');
    }

    return {
        id: results[0]._id.toString(),
        name: results[0].name,
        lastName: results[0].lastName,
        phone: results[0].phone,
        businessName: results[0].businessName,
        country: results[0].country,
        businessType: results[0].businessType,
        email: results[0].email,
        password: results[0].password,
        createdAt: results[0].createdAt,
        updatedAt: results[0].updatedAt
    };
}




