import 'dotenv/config';
import { MongoClient } from 'mongodb';
const client = new MongoClient(process.env.MONGODB_URI);
try {
 await client.connect();
 const db = client.db('test');
 for (const name of ['users','canvas','sessions']) {
  const groups = await db.collection(name).aggregate([{ $project: { keys: { $map: { input: { $objectToArray: '$$ROOT' }, as: 'field', in: '$$field.k' } } } }, { $group: { _id: '$keys', count: { $sum: 1 } } }]).toArray();
  console.log(JSON.stringify({collection:name,fieldGroups:groups}));
 }
 console.log(JSON.stringify({appUserCount:await db.collection('users').countDocuments({passwordHash:{$type:'string'}})}));
} finally {await client.close();}
