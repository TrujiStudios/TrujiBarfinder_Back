import { CreateProductDTO, ProductResponseDTO } from "../models/dtos/products/productDTO";
import { Product } from "../models/interfaces/products/productInterface";
import db from "../config/database";
import { Db, ObjectId } from 'mongodb';


export const createProductRepository = async (productData: CreateProductDTO): Promise<ProductResponseDTO> => {

    const dbInstance: Db | null = await db;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }

    const collection = dbInstance.collection<Product>('products');
    const resultCategory = await collection.insertOne({
        ...productData,
        category: new ObjectId(productData.category),
        status: true,
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
