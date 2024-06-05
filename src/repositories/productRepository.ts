import { CreateProductDTO, ProductResponseDTO, UpdateProductDTO } from "../models/dtos/products/productDTO";
import { Product, Products } from "../models/interfaces/products/productInterface";
import db from "../config/database";
import { Db, ObjectId } from 'mongodb';


export const createProductRepository = async (productData: CreateProductDTO): Promise<ProductResponseDTO> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    delete productData._id;

    const collection = dbInstance.collection<Product>('products');
    const resultCategory = await collection.insertOne({
        ...productData,
        category: new ObjectId(productData.category),
        // category: new ObjectId('60f3b3b3b3b3b3b3b3b3b3b3'),
        // status: true,
        image: 'https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png',
        createdAt: new Date(),
        updatedAt: new Date()
    });

    if (resultCategory.acknowledged === false) {
        throw new Error('Category was not created');
    }

    return {} as ProductResponseDTO;
    // return {
    //     _id: resultCategory.insertedId.toString(),
    //     name: productData.name,
    //     description: productData.description,
    //     price: productData.price,
    //     category: productData.category,
    //     company: productData.company,
    //     status: productData.status,
    //     image: productData.image,
    //     code: productData.code,
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    // };
}



export const getProductsRepository = async (companyId: string): Promise<ProductResponseDTO[]> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const resultsPrducts = dbInstance.collection<Product>('products').aggregate(
        [
            {
                $match: {
                    company: companyId
                }
            },
            {
                $lookup: {
                    from: "categories",     // collection name
                    localField: "category",  //es el campo de la coleccion actual
                    foreignField: "_id",
                    as: "category"
                },

            },
            {
                $lookup: {
                    from: "company",
                    localField: "company",
                    foreignField: "_id",
                    as: "company"
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    price: 1,
                    category: [
                        "$category._id",
                        "$category.name",
                    ],
                    company: [
                        "$company.nameCompany",
                        "$company.tipoNegocio"
                    ],
                    status: 1,
                    image: 1,
                    code: 1
                }
            }
        ]
    ).toArray();

    // console.log(await resultsPrducts);
    if (!resultsPrducts) {
        throw new Error('Error getting products');
    }

    // return resultsPrducts as ProductResponseDTO[];


    return (await resultsPrducts).map((product) => ({
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        company: product.company,
        status: product.status,
        image: product.image,
        code: product.code,
        createdAt: product.createdAt, // Add createdAt property
        updatedAt: product.updatedAt // Add updatedAt property
    }));
}



export const updateProductRepository = async (
    companyId: string,
    productId: string,
    updatedData: Partial<UpdateProductDTO>
): Promise<ProductResponseDTO | null> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }
    //updatedData.category llega como un array necesito pasar a un string
    if (updatedData.category) {
        updatedData.category = updatedData.category.toString();
    }
    delete updatedData._id;
    console.log("Data  2", updatedData);
    const result = await dbInstance.collection<Products>('products').findOneAndUpdate(
        {
            _id: new ObjectId(productId),
            company: companyId
        },
        {
            $set: {
                ...updatedData,
                updatedAt: new Date(),
                category: new ObjectId(updatedData.category) // Convert category to ObjectId
            }
        },
        {
            returnDocument: 'after'
        }
    );

    if (!result) {
        return null;
    }

    if (!result) {
        throw new Error('Category not found');
    }

    return {
        _id: result._id.toString(),
        name: result.name,
        description: result.description,
        price: result.price,
        category: result.category.toString(), // Convert ObjectId to string
        company: result.company,
        status: result.status,
        image: result.image,
        code: result.code,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
    };
};


export const deleteProductRepository = async (companyId: string, productId: string): Promise<boolean> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const result = await dbInstance.collection<Products>('products').deleteOne({
        _id: new ObjectId(productId),
        company: companyId
    });

    if (result.deletedCount === 0) {
        throw new Error('Product not found');
    }

    return true;
}