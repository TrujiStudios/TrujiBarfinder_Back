

// export interface CreateOrderDTO {
//     id?: string;
//     total: number;
//     status: string;
//     company: string;
//     user: string;
//     table: string;
//     products: Array<{
//         product: string;
//         quantity: number;
//         price: number;
//     }>;
// }




export interface CreateOrderDTO {
    id?: string;
    company: string;
    userId: string;
    tableId: string;
    status: string;
    total: number;
    createdAt: Date;
    updatedAt: Date;
    // eliminatedAt: Date;
    products: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
}

export interface OrderResponseDTO {
    id?: string;
    company: string;
    userId: string;
    tableId: string;
    status: string;
    total: number;
    createdAt: Date;
    updatedAt: Date;
    // eliminatedAt: Date;
    products: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
}

