import React from 'react';
import { motion } from 'framer-motion';

const GlobalStats = ({ totalActiveRigs, combinedHashrate, totalEarningsBTC, totalEarningsUSD }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <motion.div className="glass-panel p-4 text-center">
        <h3 className="text-gray-400 text-sm">Total Active Rigs</h3>
        <p className="text-2xl font-bold text-primary">{totalActiveRigs}</p>
      </motion.div>
      <motion.div className="glass-panel p-4 text-center">
        <h3 className="text-gray-400 text-sm">Combined Hashrate</h3>
        <p className="text-2xl font-bold text-primary">{(combinedHashrate / 1e9).toFixed(2)} GH/s</p>
      </motion.div>
      <motion.div className="glass-panel p-4 text-center">
        <h3 className="text-gray-400 text-sm">Total Estimated Earnings</h3>
        <p className="text-2xl font-bold text-primary">{totalEarningsBTC.toFixed(5)} BTC (${totalEarningsUSD.toFixed(2)})</p>
      </motion.div>
    </div>
  );
};

export default GlobalStats;