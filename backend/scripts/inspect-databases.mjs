import 'dotenv/config';
import { MongoClient } from 'mongodb';
const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
try {
 await client.connect();
 for (const name of ['test', 'canvas']) {
  const db = client.db(name);
  const collections = await db.listCollections({}, { nameOnly: true }).toArray();
  const counts = {};
  for (const c of collections) counts[c.name] = await db.collection(c.name).countDocuments();
  console.log(JSON.stringify({ database: name, collections: counts }));
 }
} finally { await client.close(); }
