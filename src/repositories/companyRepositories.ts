import { Db } from 'mongodb';
import db from '../config/database';
import { ICompany } from '../models/interfaces/auth/authInterface';
import { CompanyResponseDTO } from '../models/dtos/company/companyDTO';
import { ObjectId } from 'mongodb';
import { UserResponseDTO } from '../models/dtos/user/userDTO';

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
    // necesitoque cuando consulte por el email de usuario me traiga el name de la conpany ala que pertenece
    const collection = dbInstance.collection<any>('users');
    const user = await collection.aggregate(
        [
            {
                $match: {
                    email: email
                }
            },
            {
                $lookup: {
                    from: "company",
                    localField: "company",
                    foreignField: "_id",
                    as: "companyDetails"
                }
            },
            {
                $lookup: {
                    from: "roles",
                    localField: "roleId",
                    foreignField: "_id",
                    as: "roleDetails"
                }
            },
            {
                $project:
                {
                    _id: 1,
                    name: 1,
                    lastName: 1,
                    email: 1,
                    password: 1,
                    phone: 1,
                    status: 1,
                    roleId: 1,
                    companyId: 1,
                    company: "$companyDetails",
                    role: 1,
                }
            }
        ]
    ).toArray();

    if (!user || user.length === 0) {
        throw new Error('User does not exist');
    }

    const userResponse: UserResponseDTO = {
        id: user[0]._id.toString(),
        name: user[0].name,
        lastName: user[0].lastName,
        email: user[0].email,
        password: user[0].password,
        phone: user[0].phone,
        status: user[0].status,
        // roleId: user[0].roleId,
        company: user[0].company,
        companyId: user[0].companId,
        role: user[0].role,
        _id: '',
        documentType: '',
        typePerson: '',
    };
    return userResponse;
};

export const findCompanyByIdRepository = async (companyId: string): Promise<CompanyResponseDTO | null> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }
    const collection = dbInstance.collection<ICompany>('company');
    const company = await collection.findOne({ _id: new ObjectId(companyId) });

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

export const findCompanyByEmailRepositoryFixed = async (email: string): Promise<CompanyResponseDTO | null> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }
    const collection = dbInstance.collection<ICompany>('company');
    const results = await collection.aggregate([
        {
            $match: {
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
