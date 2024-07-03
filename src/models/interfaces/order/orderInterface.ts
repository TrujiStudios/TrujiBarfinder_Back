

export interface Order {
    id?: string;
    companyId: string;
    userId: string;
    tableId: string;
    status: string;
    total: number;
    createdAt: Date;
    updatedAt: Date;
    eliminatedAt: Date;
    products: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
}