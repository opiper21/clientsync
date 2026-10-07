import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI!);
  const bids = mongoose.connection.db.collection('bids');
  await bids.deleteMany({});
  const now = Date.now();
  await bids.insertMany([
    { bidder: 'The Johnsons (FHA)', amount: 452000, createdAt: new Date(now - 180000) },
    { bidder: 'Nguyen (Cash)', amount: 461000, createdAt: new Date(now - 90000) },
    { bidder: 'Smith (Pre-approved)', amount: 468500, createdAt: new Date(now - 30000) },
  ]);
  console.log('🌱 Seeded 3 clean demo bids');
  await mongoose.disconnect();
}
run();