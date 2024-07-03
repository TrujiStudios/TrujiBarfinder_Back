import { CreateOrderDTO, OrderResponseDTO } from "../../models/dtos/order/orderDTO";
import { createOrderRepository } from "../../repositories/orderRepository";


export const createOrderService = async (
    orderData: CreateOrderDTO
): Promise<OrderResponseDTO> => {

    try {

        const newOrder = await createOrderRepository(orderData);
        return newOrder;

    } catch (error: unknown) {
        throw new Error('Error creating company: ' + (error as Error).message);
    }
}