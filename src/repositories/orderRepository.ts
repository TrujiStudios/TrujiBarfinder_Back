import { Db, ObjectId } from "mongodb";
import db from "../config/database";
import { CreateOrderDTO, OrderResponseDTO } from "../models/dtos/order/orderDTO";
import { Order, OrderUpdate } from "../models/interfaces/order/orderInterface";
import { Products } from "../models/interfaces/products/productInterface";

export const createOrderRepository = async (orderData: CreateOrderDTO): Promise<OrderResponseDTO> => {
    const dbInstance = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

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

    const ordersCollection = dbInstance.collection<Order>('orders');
    const existingOrder = await ordersCollection.findOne({
        tableId: new ObjectId(orderData.tableId),
        status: 'pending'
    });

    if (existingOrder) {
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
        const groupedProducts = order.products.reduce((acc: any, product: any) => {
            const existingProduct = acc.find((p: any) => p.productId.toString() === product.productId.toString());
            if (existingProduct) {
                existingProduct.quantity += product.quantity;
            } else {
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

        const totalPrice = groupedProducts.reduce((sum: number, product: any) => {
            return sum + (product.price * product.quantity);
        }, 0);

        return {
            id: order._id.toString(),
            company: order.company,
            userId: order.userId,
            tableId: order.tableId,
            status: order.status,
            total: totalPrice,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            eliminatedAt: order.eliminatedAt,
            products: groupedProducts,
            table: order.table,
            userName: order.user[0] ? order.user[0].name : 'Unknown',
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

    const groupedProducts = order.products.reduce((acc: any, product: any) => {
        const existingProduct = acc.find((p: any) => p.productId.toString() === product.productId.toString());
        if (existingProduct) {
            existingProduct.quantity += product.quantity;
        } else {
            acc.push({ ...product });
        }
        return acc;
    }, []);

    const totalPrice = groupedProducts.reduce((sum: number, product: any) => {
        return sum + (product.price * product.quantity);
    }, 0);

    return {
        id: order._id.toString(),
        company: order.company,
        userId: order.userId,
        tableId: order.tableId,
        status: order.status,
        total: totalPrice,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        eliminatedAt: order.eliminatedAt,
        products: groupedProducts,
        table: order.table,
        user: order.user,
    } as OrderResponseDTO;
};

export const updateOrderRepository = async (
    companyId: string,
    orderId: string,
    updatedData: Partial<OrderUpdate>
): Promise<OrderResponseDTO> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const productsCollection = dbInstance.collection<Products>('products');
    for (const product of updatedData.products || []) {
        const productId = new ObjectId(product.productId);
        const productExists = await productsCollection.findOne({ _id: productId });
        if (!productExists) {
            throw new Error(`Product with ID ${product.productId} does not exist`);
        }
    }

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
                    price: product.price || 0
                }))
            }
        },
    );

    if (!resultOrder) {
        throw new Error('Order not found');
    }

    let total = 0;
    if (updatedData.products) {
        total = updatedData.products.reduce((acc, product) => {
            return acc + (product.price || 0) * product.quantity;
        }, 0);
    }

    if (total > 0) {
        await collection.updateOne({ _id: new ObjectId(orderId) }, { $set: { total: total } });
    }

    return {} as OrderResponseDTO;
}
