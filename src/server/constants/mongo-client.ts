import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient('mongodb://127.0.0.1:27017/squad');

export default mongoClient;
