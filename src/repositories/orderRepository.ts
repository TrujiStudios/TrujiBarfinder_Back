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

    // Verificar que cada producto exista en la base de datos y obtener su precio
    const productsCollection = dbInstance.collection<Products>('products');
    const resolvedProducts = await Promise.all(orderData.products.map(async product => {
        const productId = new ObjectId(product.productId);
        const productData = await productsCollection.findOne({ _id: productId });
        if (!productData) {
            throw new Error(`Product with ID ${product.productId} does not exist`);
        }
        return {
            ...product,
            productId: productId,
            price: productData.price
        };
    }));

    // Verificar si la mesa ya tiene una orden existente
    const ordersCollection = dbInstance.collection<Order>('orders');
    const existingOrder = await ordersCollection.findOne({
        tableId: new ObjectId(orderData.tableId),
        status: 'pending'
    });

    if (existingOrder) {
        // Agregar los nuevos productos a la orden existente
        const updatedProducts = [...existingOrder.products, ...resolvedProducts];
        const total = updatedProducts.reduce((acc, product) => {
            return acc + product.price * product.quantity;
        }, 0);

        await ordersCollection.updateOne(
            { _id: existingOrder._id },
            {
                $set: {
                    products: updatedProducts,
                    userId: new ObjectId(orderData.company),
                    total: total,
                    updatedAt: new Date()
                }
            }
        );

        return {
            id: existingOrder._id.toString(),
            company: existingOrder.companyId,
            userId: existingOrder.userId,
            tableId: existingOrder.tableId,
            status: existingOrder.status,
            total: total,
            createdAt: existingOrder.createdAt,
            updatedAt: new Date(),
            products: updatedProducts
        } as unknown as OrderResponseDTO;
    } else {
        // Continuar con la lógica original para crear una nueva orden
        const total = resolvedProducts.reduce((acc, product) => {
            return acc + product.price * product.quantity;
        }, 0);

        orderData.total = total;

        const resultOrder = await ordersCollection.insertOne({
            ...orderData,
            tableId: new ObjectId(orderData.tableId),
            userId: new ObjectId(orderData.company),
            products: resolvedProducts.map(product => ({
                productId: product.productId,
                quantity: product.quantity,
                price: product.price,
                userId: new ObjectId(orderData.company),
            })),
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            companyId: orderData.company,
        });

        if (resultOrder.acknowledged === false) {
            throw new Error('Order was not created');
        }

        // Actualizar el documento de tables el campo de occupied a true
        const tablesCollection = dbInstance.collection('tables');
        const tableId = new ObjectId(orderData.tableId);
        await tablesCollection.updateOne(
            { _id: tableId },
            {
                $set: { occupied: true }
            }
        );

        return {
            id: resultOrder.insertedId.toString(),
            company: orderData.company,
            userId: orderData.company,
            tableId: orderData.tableId,
            status: 'pending',
            total: orderData.total,
            createdAt: new Date(),
            updatedAt: new Date(),
            products: resolvedProducts,
        } as unknown as OrderResponseDTO;
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
                    as: 'productos'
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
                    productos: {
                        _id: 1,
                        name: 1,
                        price: 1
                    },
                    table: 1,
                    user: 1,
                }
            }
        ]
    ).toArray();

    return resultsOrders.map(order => {
        // Agrupar productos por productId y sumar cantidad y precio
        const groupedProducts = order.products.reduce((acc: any, product: any) => {
            const existingProduct = acc.find((p: any) => p.productId.toString() === product.productId.toString());
            if (existingProduct) {
                // Si ya existe el producto, sumar la cantidad
                existingProduct.quantity += product.quantity;
            } else {
                // Si no existe, agregarlo al acumulador
                const productDetails = order.productos.find((p: any) => p._id.toString() === product.productId.toString());
                acc.push({
                    ...product,
                    name: productDetails ? productDetails.name : 'Unknown',
                    price: productDetails ? productDetails.price : 0,
                    user: order.user[0] ? order.user[0].name : 'Unknown',
                });
            }
            return acc;
        }, []);

        // Calcular el total de la orden sumando los precios de los productos agrupados
        const totalPrice = groupedProducts.reduce((sum: number, product: any) => {
            return sum + (product.price * product.quantity);
        }, 0);

        return {
            id: order._id.toString(), // Convertir ObjectId a string
            company: order.company,
            userId: order.userId,
            tableId: order.tableId,
            status: order.status,
            total: totalPrice, // Usar el total calculado
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            eliminatedAt: order.eliminatedAt,
            products: groupedProducts, // Usar los productos agrupados
            table: order.table,
            userName: order.user[0] ? order.user[0].name : 'Unknown',
        } as OrderResponseDTO;
    });
}





// return (await resultsOrders).map(order => {
//     return {
//         id: order._id,
//         company: order.company,
//         userId: order.userId,
//         tableId: order.tableId,
//         status: order.status,
//         total: order.total,
//         createdAt: order.createdAt,
//         updatedAt: order.updatedAt,
//         eliminatedAt: order.eliminatedAt,
//         products: order.products,
//         quantity: order.products.quantity,
//         table: order.table,
//         user: order.user,
//         price: order.price || 0
//     } as OrderResponseDTO;
// });


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
                    as: 'productos'
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
                    productos: 1,
                    table: 1,
                    user: 1,
                }
            }
        ]
    ).toArray();

    if (resultOrder.length === 0) {
        throw new Error('Order not found');
    }

    const order = resultOrder[0];

    // Agrupar productos por productId y sumar cantidad y precio
    const groupedProducts = order.products.reduce((acc: any, product: any) => {
        const existingProduct = acc.find((p: any) => p.productId.toString() === product.productId.toString());
        if (existingProduct) {
            // Si ya existe el producto, sumar la cantidad y el precio
            existingProduct.quantity += product.quantity;
            // existingProduct.price += product.price;
        } else {
            // Si no existe, agregarlo al acumulador
            acc.push({ ...product });
        }
        return acc;
    }, []);

    // Calcular el total de la orden sumando los precios de los productos agrupados
    const totalPrice = groupedProducts.reduce((sum: number, product: any) => {
        return sum + (product.price * product.quantity);
    }, 0);

    return {
        id: order._id.toString(), // Convertir ObjectId a string
        company: order.company,
        userId: order.userId,
        tableId: order.tableId,
        status: order.status,
        total: totalPrice, // Usar el total calculado
        // total: order.total,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        eliminatedAt: order.eliminatedAt,
        products: groupedProducts, // Usar los productos agrupados
        table: order.table,
        user: order.user,
    } as OrderResponseDTO;
};



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