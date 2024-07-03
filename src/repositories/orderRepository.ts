import db from "../config/database";
import { CreateOrderDTO, OrderResponseDTO } from "../models/dtos/order/orderDTO";
import { Order } from "../models/interfaces/order/orderInterface";
// import { BadRequest } from "../utils/errors/errors";


export const createOrderRepository = async (orderData: CreateOrderDTO): Promise<OrderResponseDTO> => {

    const dbInstance = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const collection = dbInstance.collection<Order>('orders');
    const resultOrder = await collection.insertOne({
        ...orderData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
    });

    if (resultOrder.acknowledged === false) {
        throw new Error('Order was not created');
    }

    return {} as OrderResponseDTO;
}