import { Router } from 'express';
import Bid from '../models/Bid';

const router = Router();

router.get('/', async (_req, res) => {
  const bids = await Bid.find().sort({ createdAt: -1 });
  res.json(bids);
});

router.post('/', async (req, res) => {
  const { bidder, amount } = req.body;
  const bid = await Bid.create({ bidder, amount });
  req.app.get('io').emit('bid:new', bid);
  res.status(201).json(bid);
});

export default router;