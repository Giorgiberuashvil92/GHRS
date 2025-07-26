import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://beruashvilig60:Berobero1234!@cluster0.dtwfws3.mongodb.net/grs-db';

async function clearCollections() {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db('grs-db');

    // კოლექციების სია რომელიც უნდა გაიწმინდოს
    const collections = ['categories', 'sets', 'exercises'];

    for (const collectionName of collections) {
      try {
        await db.collection(collectionName).drop();
      } catch (err) {
        if ((err as any).code === 26) {
        } else {
          console.error(`Error dropping collection ${collectionName}:`, err);
        }
      }
    }

    // წავშალოთ ყველა ინდექსი
    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName);
        await collection.dropIndexes();
      } catch (err) {
        console.error(`Error dropping indexes for ${collectionName}:`, err);
      }
    }

    await client.close();
  } catch (err) {
    console.error('Error connecting to database:', err);
  }
}

clearCollections(); 