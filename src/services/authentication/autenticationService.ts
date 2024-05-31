// import { CompanyResponseDTO } from '../../dtos/companyDTO';
import { CreateComanyDTO, CompanyResponseDTO } from '../../dtos/companyDTO';
// import { ICompany } from '../../interfaces/companyInterface';
// import db from '../../config/database';
// import { Db } from 'mongodb';
import { createCompanyRepository } from '../../repositories/authRepositories';



const createCompanyService = async (companyData: CreateComanyDTO): Promise<CompanyResponseDTO> => {

    try {
        const newCompany = await createCompanyRepository(companyData);
        return newCompany;
    } catch (error) {
        throw new Error('Company was not created');
    }
}





export default createCompanyService;


