import { CreateUserDTO, UserResponseDTO } from "../../models/dtos/user/userDTO";
import { createUserRepository } from "../../repositories/userRepository";


export const createUserService = async (
    orderData: CreateUserDTO
): Promise<UserResponseDTO> => {

    try {

        const resultUsers = await createUserRepository(orderData);
        return resultUsers;

    } catch (error: unknown) {
        throw new Error('Error creating company: ' + (error as Error).message);
    }
}


// export const getOrderService = async (companyId: string): Promise<OrderResponseDTO[]> => {
//     try {
//         const orders = await getOrderRepository(companyId);
//         return orders;
//     } catch (error: unknown) {
//         throw new Error('Error getting orders: ' + (error as Error).message);
//     }
// }