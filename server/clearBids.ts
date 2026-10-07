import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI!);
  const res = await mongoose.connection.db.collection('bids').deleteMany({});
  console.log(`🧹 Deleted ${res.deletedCount} bids`);
  await mongoose.disconnect();
}
run();