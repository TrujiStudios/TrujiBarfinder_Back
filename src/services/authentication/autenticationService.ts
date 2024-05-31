import { CreateCompanyDTO, CompanyResponseDTO } from '../../dtos/companyDTO';
import { createCompanyRepository } from '../../repositories/authRepositories';
import { findCompanyByEmailRepository } from '../../repositories/companyRepositories';



const createCompanyService = async (companyData: CreateCompanyDTO): Promise<CompanyResponseDTO> => {

    try {

        const existingCompany: boolean = await findCompanyByEmailRepository(companyData.email);
        if (existingCompany) {
            throw new Error('Company with this email already exists');
        }

        // Transformar datos antes de guardarlos
        // const transformedData = {
        //     ...companyData,
        //     name: companyData.name.trim(),
        //     email: companyData.email.toLowerCase(),
        // };
        let resultsCompany: CompanyResponseDTO = await createCompanyRepository(companyData);

        // Registrar la actividad
        // logActivity('Company created', newCompany);

        // Enviar notificación
        //  await sendEmail(newCompany.email, 'Company Created', 'Your company has been successfully created.');


        return resultsCompany;

    } catch (error) {
        throw new Error('Error creating company: ' + (error as Error).message);
    }
}







export default createCompanyService;


