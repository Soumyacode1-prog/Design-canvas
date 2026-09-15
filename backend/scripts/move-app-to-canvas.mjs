import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { isDeepStrictEqual } from 'node:util';

const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
try {
  await client.connect();
  const source = client.db('test'), target = client.db('canvas');
  // Match this app's scrypt format and exclude the unrelated shop's user schema.
  const userFilter = { passwordHash: /^[a-f0-9]{32}:[a-f0-9]{128}$/, role: { $exists: false }, addresses: { $exists: false }, emailVerified: { $exists: false } };
  const appUsers = await source.collection('users').find(userFilter).toArray();
  const ids = appUsers.map(user => user._id);
  const filters = {
    users: { _id: { $in: ids } },
    canvas: { title: { $type: 'string' }, width: { $type: 'number' }, height: { $type: 'number' }, elements: { $type: 'array' } },
    sessions: { user: { $in: ids }, accessHash: { $type: 'string' }, refreshHash: { $type: 'string' } },
  };
  const summary = {};
  for (const [name, filter] of Object.entries(filters)) summary[name] = await source.collection(name).countDocuments(filter);
  console.log(JSON.stringify({ from: 'test', to: 'canvas', documents: summary, apply: process.argv.includes('--apply') }));
  if (process.argv.includes('--apply')) {
    // Ensure collections exist before the multi-database transaction.
    for (const name of Object.keys(filters)) {
      if (!await target.listCollections({ name }).hasNext()) await target.createCollection(name);
    }
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        for (const [name, filter] of Object.entries(filters)) {
          const documents = await source.collection(name).find(filter, { session }).toArray();
          for (const document of documents) {
            const existing = await target.collection(name).findOne({ _id: document._id }, { session });
            if (existing && !isDeepStrictEqual(existing, document)) throw new Error(`Conflicting document in target ${name}; migration aborted`);
            if (!existing) await target.collection(name).insertOne(document, { session });
            const copied = await target.collection(name).findOne({ _id: document._id }, { session });
            if (!isDeepStrictEqual(copied, document)) throw new Error(`Verification failed for ${name}`);
          }
          if (documents.length) {
            const deleted = await source.collection(name).deleteMany({ _id: { $in: documents.map(doc => doc._id) } }, { session });
            if (deleted.deletedCount !== documents.length) throw new Error(`Source changed for ${name}`);
          }
        }
      }, { readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } });
    } finally { await session.endSession(); }
    for (const [name, filter] of Object.entries(filters)) {
      console.log(JSON.stringify({ collection: name, remainingAppDocumentsInTest: await source.collection(name).countDocuments(filter), targetCount: await target.collection(name).countDocuments() }));
    }
  }
} finally { await client.close(); }
