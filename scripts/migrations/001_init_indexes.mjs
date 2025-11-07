import mongoose from 'mongoose';

const uri = process.env.MONGO_URI;
await mongoose.connect(uri);

const seeds = new mongoose.Schema({ name: { type: String, index: true } });
const priceHistory = new mongoose.Schema({ seedId: String, seedbank: String, date: Date });

await mongoose.connection.db.collection('seeds').createIndex({ name: 1 });
await mongoose.connection.db.collection('priceHistory').createIndex({ seedId: 1, seedbank: 1, date: -1 });

console.log('indexes created');
process.exit(0);