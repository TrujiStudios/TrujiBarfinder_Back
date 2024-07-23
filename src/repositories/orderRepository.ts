import { Db, ObjectId } from "mongodb";
import db from "../config/database";
import { CreateOrderDTO, OrderResponseDTO } from "../models/dtos/order/orderDTO";
import { Order, OrderUpdate } from "../models/interfaces/order/orderInterface";
import { Products } from "../models/interfaces/products/productInterface";
// import { BadRequest } from "../utils/errors/errors";


export const createOrderRepository = async (orderData: CreateOrderDTO): Promise<OrderResponseDTO> => {
    const dbInstance = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    // Verificar que cada producto exista en la base de datos
    const productsCollection = dbInstance.collection<Products>('products');
    for (const product of orderData.products) {
        const productId = new ObjectId(product.productId);
        const productExists = await productsCollection.findOne({ _id: productId });
        if (!productExists) {
            throw new Error(`Product with ID ${product.productId} does not exist`);
        }
    }

    // Continuar con la lógica original para crear la orden
    if (orderData.products.length > 0) {
        orderData.products = await Promise.all(orderData.products.map(async product => {
            const resolvedPrice = await productsCollection.findOne({ _id: new ObjectId(product.productId) }).then(product => product?.price);
            return {
                ...product,
                productId: new ObjectId(product.productId).toString(),
                price: resolvedPrice || 0
            };
        })) as { productId: string; quantity: number; price: number; }[];
    }


    const total = orderData.products.reduce((acc, product) => {
        return acc + product.price * product.quantity;
    }, 0);

    orderData.total = total;

    const collection = dbInstance.collection<Order>('orders');
    const resultOrder = await collection.insertOne({
        ...orderData,
        tableId: new ObjectId(orderData.tableId),
        userId: new ObjectId(orderData.userId),
        products: orderData.products.map(product => {
            return {
                productId: new ObjectId(product.productId),
                quantity: product.quantity,
                // price: product.price,
                price: product.price || 0

            }
        }),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        companyId: orderData.company,
        // eliminatedAt: undefined
    });

    if (resultOrder.acknowledged === false) {
        throw new Error('Order was not created');
    }


    //actualizar la el documento de tables el campo de occupied a true 
    const tablesCollection = dbInstance.collection('tables');
    const tableId = new ObjectId(orderData.tableId);
    await tablesCollection.updateOne(
        { _id: tableId },
        {
            $set: { occupied: true }
        }
    );


    // return {} as OrderResponseDTO;
    return {
        id: resultOrder.insertedId.toString(),
        company: orderData.company,
        userId: orderData.userId,
        tableId: orderData.tableId,
        status: orderData.status,
        total: orderData.total,
        createdAt: new Date(),
        updatedAt: new Date(),
        products: orderData.products,
    }
}






export const getOrderRepository = async (companyId: string): Promise<OrderResponseDTO[]> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const resultsOrders = await dbInstance.collection<Order>('orders').aggregate(
        [
            {
                $match: {
                    company: companyId
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'tables',
                    localField: 'tableId',
                    foreignField: '_id',
                    as: 'table'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'products'
                }
            },
            {
                $project: {
                    company: 1,
                    userId: 1,
                    tableId: 1,
                    status: 1,
                    total: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    products: 1,
                    table: 1,
                    user: 1,
                }
            }
        ]
    ).toArray();


    return (await resultsOrders).map(order => {
        return {
            id: order._id,
            company: order.company,
            userId: order.userId,
            tableId: order.tableId,
            status: order.status,
            total: order.total,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            eliminatedAt: order.eliminatedAt,
            products: order.products,
            table: order.table,
            user: order.user,
            price: order.price || 0
        } as OrderResponseDTO;
    });
}

export const getOneOrderRepository = async (companyId: string, orderId: string): Promise<OrderResponseDTO> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const resultOrder = await dbInstance.collection<Order>('orders').aggregate(
        [
            {
                $match: {
                    _id: new ObjectId(orderId),
                    company: companyId
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'tables',
                    localField: 'tableId',
                    foreignField: '_id',
                    as: 'table'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'products'
                }
            },
            {
                $project: {
                    company: 1,
                    userId: 1,
                    tableId: 1,
                    status: 1,
                    total: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    products: 1,
                    table: 1,
                    user: 1,
                }
            }
        ]
    ).toArray();

    const order = await resultOrder;

    return {
        id: order[0]._id,
        company: order[0].company,
        userId: order[0].userId,
        tableId: order[0].tableId,
        status: order[0].status,
        total: order[0].total,
        createdAt: order[0].createdAt,
        updatedAt: order[0].updatedAt,
        products: order[0].products,
        table: order[0].table,
        user: order[0].user,
        price: order[0].price || 0
    } as OrderResponseDTO;
}


// import { ObjectId } from "mongodb";

// export const updateOrderRepository = async (
//     companyId: string,
//     orderId: string,
//     updatedData: Partial<OrderUpdate>
// ): Promise<OrderResponseDTO> => {

//     const dbInstance: Db | null = await db;
//     if (!dbInstance) {
//         throw new Error('Database instance is null');
//     }

//     const collection = dbInstance.collection<OrderUpdate>('orders');

//     const resultOrder = await collection.findOneAndUpdate(
//         {
//             _id: new ObjectId(orderId),
//             company: companyId
//         },
//         {
//             $set: {
//                 ...updatedData,
//                 updatedAt: new Date(),
//                 userId: new ObjectId(updatedData.userId),
//                 tableId: new ObjectId(updatedData.tableId),
//                 products: updatedData.products?.map(product => {
//                     return {
//                         productId: new ObjectId(product.productId),
//                         quantity: product.quantity,
//                         // price: product.price
//                     }
//                 }
//                 )
//             }
//         },
//     );

//     if (!resultOrder) {
//         throw new Error('Order not found');
//     }

//     console.log('resultOrder', resultOrder);



//     return {} as OrderResponseDTO;
// }




export const updateOrderRepository = async (
    companyId: string,
    orderId: string,
    updatedData: Partial<OrderUpdate>
): Promise<OrderResponseDTO> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    // Verificar que cada producto exista en la base de datos
    const productsCollection = dbInstance.collection<Products>('products');
    for (const product of updatedData.products || []) {
        const productId = new ObjectId(product.productId);
        const productExists = await productsCollection.findOne({ _id: productId });
        if (!productExists) {
            throw new Error(`Product with ID ${product.productId} does not exist`);
        }
    }

    // Continuar con la lógica original para actualizar la orden

    const collection = dbInstance.collection<Order>('orders');
    const resultOrder = await collection.findOneAndUpdate(
        {
            _id: new ObjectId(orderId),
            company: companyId
        },
        {
            $set: {
                ...updatedData,
                updatedAt: new Date(),
                userId: new ObjectId(updatedData.userId),
                tableId: new ObjectId(updatedData.tableId),
                products: updatedData.products?.map(product => ({
                    productId: new ObjectId(product.productId),
                    quantity: product.quantity,
                    price: product.price || 0 // Asegurar que price no sea undefined
                }))
            }
        },
    );

    if (!resultOrder) {
        throw new Error('Order not found');
    }

    // Calcular el total solo si hay productos
    let total = 0;
    if (updatedData.products) {
        total = updatedData.products.reduce((acc, product) => {
            // Asegurar que price no sea undefined al calcular el total
            return acc + (product.price || 0) * product.quantity;
        }, 0);
    }

    // Actualizar el total en la base de datos si es necesario
    // Esta parte del código asume que quieres actualizar el total en la base de datos
    // Si no es necesario, puedes omitir esta parte o ajustarla según tus necesidades
    if (total > 0) {
        await collection.updateOne({ _id: new ObjectId(orderId) }, { $set: { total: total } });
    }

    return {} as OrderResponseDTO; // Asegúrate de devolver el DTO actualizado correctamente
}