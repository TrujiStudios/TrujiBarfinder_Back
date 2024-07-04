import { CreateOrderDTO, OrderResponseDTO } from "../../models/dtos/order/orderDTO";
import { createOrderRepository, getOrderRepository } from "../../repositories/orderRepository";


export const createOrderService = async (
    orderData: CreateOrderDTO
): Promise<OrderResponseDTO> => {

    try {

        console.log('orderData', orderData.products[0].productId);

        // const total = orderData.products.reduce((acc, product) => {
        //     return acc + product.price * product.quantity;
        // }, 0);

        // orderData.total = total;

        const newOrder = await createOrderRepository(orderData);
        return newOrder;

    } catch (error: unknown) {
        throw new Error('Error creating company: ' + (error as Error).message);
    }
}


export const getOrderService = async (companyId: string): Promise<OrderResponseDTO[]> => {
    try {
        const orders = await getOrderRepository(companyId);
        return orders;
    } catch (error: unknown) {
        throw new Error('Error getting orders: ' + (error as Error).message);
    }
}