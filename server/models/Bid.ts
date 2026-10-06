import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  bidder: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Bid', bidSchema);