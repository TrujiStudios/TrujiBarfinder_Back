import { CompanyResponseDTO } from "../../models/dtos/company/companyDTO";
import { getCompaniesRepository } from "../../repositories/authRepositories";
import { findCompanyByEmailRepositoryFixed } from "../../repositories/companyRepositories";
import { comparePassword } from "../../utils/encrypt";

export const getCompaniesService = async (): Promise<{ companies: CompanyResponseDTO[], count: number }> => {
    try {
        const companies = await getCompaniesRepository();
        return companies;
    } catch (error: unknown) {
        throw new Error('Error getting companies: ' + (error as Error).message);
    }
}


export const findCompanyByEmailServiceFixed = async (email: string, password: string): Promise<CompanyResponseDTO | null> => {
    try {
        const companyResults = await findCompanyByEmailRepositoryFixed(email);

        if (!companyResults) {
            throw new Error('Company not found');
        }

        if (!password) {
            throw new Error('Password is required');
        }

        if (!companyResults.password) {
            throw new Error('Password not found for the company');
        }

        await comparePassword(password, companyResults.password);

        return companyResults;
    } catch (error: unknown) {
        throw new Error('Error finding company: ' + (error as Error).message);
    }
}