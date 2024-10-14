
import { CreateCompanyDTO, CompanyResponseDTO } from '../models/dtos/company/companyDTO';
import { Db } from 'mongodb';
import db from '../config/database';
import { ICompany } from '../models/interfaces/auth/authInterface';
import { createPlantillaRolAdminRepository, createPlantillaRolUserRepository } from './roleRepository';



// export const createPlantillaRolAdminRepository = async (): Promise<void> => {
//     const dbInstance: Db | null = await db;
//     if (!dbInstance) {
//         throw new Error('Database instance is null');
//     }
//     const collection = dbInstance.collection('roles');
//     const result = await collection.insertOne(plantillaRolAdmin);
//     if (result.acknowledged === false) {
//         throw new Error('PlantillaRolAdmin was not created');
//     }
// };


export const createCompanyRepository = async (companyData: CreateCompanyDTO): Promise<CompanyResponseDTO> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }


    const collection = dbInstance.collection<ICompany>('company');
    const resultCompany = await collection.insertOne({
        ...companyData,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    if (resultCompany.acknowledged === false) {
        throw new Error('Company was not created');
    }

    const result = await createPlantillaRolAdminRepository(resultCompany.insertedId.toString());
    await createPlantillaRolUserRepository(resultCompany.insertedId.toString());

    await collection.updateOne({ _id: resultCompany.insertedId }, { $set: { roleId: result.insertedIds[0] } });


    return {
        id: resultCompany.insertedId.toString(),
        name: companyData.name,
        lastName: companyData.lastName,
        phone: companyData.phone,
        businessName: companyData.businessName,
        country: companyData.country,
        businessType: companyData.businessType,
        email: companyData.email,
        // password: companyData.password,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};


export const getCompaniesRepository = async (): Promise<{ companies: CompanyResponseDTO[], count: number }> => {
    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }
    const collection = dbInstance.collection<ICompany>('company');
    const companies = await collection.find().toArray();
    const count = await collection.countDocuments();
    return {
        count,
        companies: companies.map((company) => {
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
                updatedAt: company.updatedAt,
            };
        }),
    };
};