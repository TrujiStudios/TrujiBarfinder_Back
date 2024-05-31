import { CreateCompanyDTO, CompanyResponseDTO, Payload } from '../../dtos/companyDTO';
// import { ICompany } from '../../interfaces/companyInterface';
import { createCompanyRepository } from '../../repositories/authRepositories';
import { byEmailcompanyRepository, findCompanyByEmailRepository } from '../../repositories/companyRepositories';
import { createToken } from '../../utils/createToken';
import { comparePassword, encrypt } from '../../utils/encrypt';



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

        if (companyData.password) {
            // Encriptar la contraseña
            companyData.password = await encrypt(companyData.password);
        }

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


export const authLoginCompanyServices = async (companyData: Payload): Promise<{ company: CompanyResponseDTO, token: string }> => {

    try {

        const existingCompany = await byEmailcompanyRepository(companyData.email);

        if (!existingCompany) {
            throw new Error('Company does not exist');
        }

        if (!existingCompany.password) {
            throw new Error('Password is required');
        }

        if (!companyData.password) {
            throw new Error('Password is required');
        }

        await comparePassword(companyData.password, existingCompany.password);

        const token = await createToken({ id: existingCompany._id, email: existingCompany.email });

        return {
            company: existingCompany,
            token
        };



    } catch (error) {
        throw new Error('Error creating company: ' + (error as Error).message);
    }
}








export default createCompanyService;


