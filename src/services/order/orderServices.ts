import { CreateOrderDTO, OrderResponseDTO } from "../../models/dtos/order/orderDTO";
import { OrderUpdate } from "../../models/interfaces/order/orderInterface";
import { createOrderRepository, getOneOrderRepository, getOrderRepository, updateOrderRepository } from "../../repositories/orderRepository";
// import { accessModuleService } from "../role/roleService";


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
        // const module = 'order';
        // const userId = '670d74c14d5d518e3dfa34d4'; // This should be dynamic
        // const result = await accessModuleService(companyId, userId, module);


        // console.log('result', result);

        const orders = await getOrderRepository(companyId);
        return orders;
    } catch (error: unknown) {
        throw new Error('Error getting orders: ' + (error as Error).message);
    }
}

export const getOneOrderService = async (
    companyId: string,
    orderId: string
): Promise<OrderResponseDTO> => {
    try {
        const order = await getOneOrderRepository(companyId, orderId);
        return order;
    } catch (error: unknown) {
        throw new Error('Error getting order: ' + (error as Error).message);
    }
}

export const updateOrderService = async (
    companyId: string,
    orderId: string,
    updatedData: Partial<OrderUpdate>
): Promise<OrderResponseDTO> => {
    try {
        const resultsOrder = await updateOrderRepository(companyId, orderId, updatedData);
        return resultsOrder;
    } catch (error: unknown) {
        throw new Error('Error updating order: ' + (error as Error).message);
    }
}