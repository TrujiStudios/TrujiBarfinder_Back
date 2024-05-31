import { CompanyResponseDTO } from "../../dtos/companyDTO";
import { getCompaniesRepository } from "../../repositories/authRepositories";

export const getCompaniesService = async (): Promise<{ companies: CompanyResponseDTO[], count: number }> => {
    try {
        const companies = await getCompaniesRepository();
        return companies;
    } catch (error: unknown) {
        throw new Error('Error getting companies: ' + (error as Error).message);
    }
}