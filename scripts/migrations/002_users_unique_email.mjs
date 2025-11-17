import mongoose from 'mongoose';

const uri = process.env.MONGO_URI;
await mongoose.connect(uri);

await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
console.log('users.email unique index ensured');
process.exit(0);