import { CreateComanyDTO, CompanyResponseDTO } from '../../dtos/companyDTO';
import { createCompanyRepository } from '../../repositories/authRepositories';



const createCompanyService = async (companyData: CreateComanyDTO): Promise<CompanyResponseDTO> => {

    try {

        // Validación de negocio: Verificar si ya existe una compañía con el mismo email


        // Transformar datos antes de guardarlos
        //  const transformedData = {
        //     ...companyData,
        //     name: companyData.name.trim(),
        //     email: companyData.email.toLowerCase(),
        // };

        const newCompany = await createCompanyRepository(companyData);

        // Registrar la actividad
        // logActivity('Company created', newCompany);

        // Enviar notificación
        //  await sendEmail(newCompany.email, 'Company Created', 'Your company has been successfully created.');


        return newCompany;

    } catch (error) {
        throw new Error('Error creating company: ' + (error as Error).message);
    }
}





export default createCompanyService;


