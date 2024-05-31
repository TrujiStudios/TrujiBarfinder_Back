import { CompanyResponseDTO, Payload } from "../../dtos/companyDTO";



export const validateCompanyData = (companyData: Payload, existingCompany: CompanyResponseDTO) => {
    if (!existingCompany) {
        throw new Error('Company does not exist');
    }

    if (!existingCompany.password) {
        throw new Error('Existing company password is required');
    }

    if (!companyData.password) {
        throw new Error('Company data password is required');
    }
}