import { MongoClient, Db } from 'mongodb';

import { environment } from './environment';


const client = new MongoClient(environment.databaseURL || '');

async function connect(): Promise<Db | null> {
    try {
        await client.connect();
        const db = client.db(environment.databaseName);
        // const collection = db.collection('example-collection');
        // const results = await collection.insertOne({ name: 'example' });
        // console.log('Inserted one document', results.insertedId);
        console.log('Connected to the database =>>>', db.databaseName);
        console.log();

        return db;

    } catch (error) {
        console.error('Error connecting to the database', error);
        return null; // Add this line to return a value in case of an error
    }
}

const db = connect();


export default db;