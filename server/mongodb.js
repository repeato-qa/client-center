import { MongoClient } from 'mongodb';

const dbName = 'Repeato'; // Database Name
let indexesCreated = false;
async function createIndexes(client) {
  if (indexesCreated) return client;
  const db = client.db(dbName);
  await Promise.all([
    db
      .collection('Tokens')
      .createIndex({ expireAt: -1 }, { expireAfterSeconds: 0 }),
    db.collection('Users').createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { id: 1 }, unique: true },
    ]),
  ]);
  indexesCreated = true;
  return client;
}

export async function getMongoClient() {
  /**
   * Global is used here to maintain a cached connection across hot reloads
   * in development. This prevents connections growing exponentiatlly
   * during API Route usage.
   * https://github.com/vercel/next.js/pull/17666
   */
  if (!global.mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    // client.connect() returns an instance of MongoClient when resolved
    global.mongoClientPromise = client
      .connect()
      .then((client) => createIndexes(client));
  }
  return global.mongoClientPromise;
}

export async function getMongoDb() {
  const mongoClient = await getMongoClient();
  return mongoClient.db(dbName);
}
