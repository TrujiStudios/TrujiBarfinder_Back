import { CreateUserDTO, UserResponseDTO } from "../../models/dtos/user/userDTO";
import { byEmailUserRepository } from "../../repositories/companyRepositories";
import { createUserRepository } from "../../repositories/userRepository";
import { encrypt } from "../../utils/encrypt";
import { Unauthorized } from "../../utils/errors/errors";


export const createUserService = async (
    orderData: CreateUserDTO
): Promise<UserResponseDTO> => {

    try {

        if (orderData.password) {
            orderData.password = await encrypt(orderData.password);
        }

        const resultUsers = await createUserRepository(orderData);
        return resultUsers;

    } catch (error: unknown) {
        throw new Error('Error creating company: ' + (error as Error).message);
    }
}

export const findUserByEmailService = async (email: string) => {
    const user = await byEmailUserRepository(email);
    if (!user) throw new Unauthorized('User not found');

    // Verificamos la contraseña
    // await comparePassword(password, user.password);

    return user;
};



// export const getOrderService = async (companyId: string): Promise<OrderResponseDTO[]> => {
//     try {
//         const orders = await getOrderRepository(companyId);
//         return orders;
//     } catch (error: unknown) {
//         throw new Error('Error getting orders: ' + (error as Error).message);
//     }
// }