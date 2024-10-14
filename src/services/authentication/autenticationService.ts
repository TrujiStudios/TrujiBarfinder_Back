import { CreateCompanyDTO, CompanyResponseDTO, Payload } from '../../models/dtos/company/companyDTO';
import { UserResponseDTO } from '../../models/dtos/user/userDTO';
// import { ICompany } from '../../interfaces/companyInterface';
import { createCompanyRepository } from '../../repositories/authRepositories';
import { byEmailcompanyRepository, byEmailUserRepository, findCompanyByEmailRepository } from '../../repositories/companyRepositories';
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

        if (!companyData.email) {
            throw new Error('Email is required');
        }

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

        const token = await createToken({ sub: existingCompany._id } as Payload);

        return {
            company: existingCompany,
            token
        };



    } catch (error) {
        throw new Error('Error creating company: ' + (error as Error).message);
    }
}

export const authLoginUserServices = async (userData: Payload): Promise<{ user: UserResponseDTO, token: string }> => {
    try {
        if (!userData.email) {
            throw new Error('Email is required');
        }

        const existingUser = await byEmailUserRepository(userData.email);

        if (!existingUser) {
            throw new Error('User does not exist');
        }

        if (!existingUser.password) {
            throw new Error('Password is required');
        }

        if (!userData.password) {
            throw new Error('Password is required');
        }

        await comparePassword(userData.password, existingUser.password);

        const token = await createToken({ sub: existingUser.company } as unknown as Payload);
        console.log('token', token);
        return {
            user: existingUser,
            token
        };
    } catch (error) {
        throw new Error('Error logging in user: ' + (error as Error).message);
    }
};









export default createCompanyService;


