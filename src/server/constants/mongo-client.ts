import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/squad`);

export default mongoClient;
