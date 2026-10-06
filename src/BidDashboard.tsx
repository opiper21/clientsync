import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, TrendingUp, Zap } from 'lucide-react';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

interface Bid { _id: string; bidder: string; amount: number; createdAt: string; }

export default function BidDashboard() {
  const [bids, setBids] = useState<Bid[]>([]);
  const top = bids[0]?.amount ?? 450000;

  useEffect(() => {
    fetch(`${API_URL}/bids`).then((r) => r.json()).then(setBids);
    const onBid = (bid: Bid) => setBids((prev) => [bid, ...prev]);
    socket.on('bid:new', onBid);
    return () => { socket.off('bid:new', onBid); };
  }, []);

  const placeBid = async (bump: number) => {
    await fetch(`${API_URL}/bids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bidder: 'You', amount: top + bump }),
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="text-yellow-400" /> OfferFlow
          </h1>
          <span className="flex items-center gap-2 bg-red-500/10 text-red-400 text-xs font-semibold px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> LIVE AUCTION
          </span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 text-gray-300 mb-4">
            <Home size={18} />
            <span className="font-medium">123 Maple Avenue • 4 bd • 3 ba • 2,400 sqft</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <TrendingUp size={14} /> HIGHEST OFFER
          </div>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={top}
              initial={{ y: 24, opacity: 0, scale: 1.06 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -24, opacity: 0 }}
              className="text-5xl font-bold text-green-400"
            >
              ${top.toLocaleString()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1000, 5000, 10000].map((bump) => (
            <button
              key={bump}
              onClick={() => placeBid(bump)}
              className="bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold transition-colors"
            >
              +${bump.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {bids.map((bid) => (
            <motion.div
              key={bid._id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-between bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm"
            >
              <span className={bid.bidder === 'You' ? 'text-green-400 font-medium' : 'text-gray-300'}>
                {bid.bidder}
              </span>
              <span className="text-gray-400">${bid.amount.toLocaleString()}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}