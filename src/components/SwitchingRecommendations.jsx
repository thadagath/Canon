import React from 'react';

const SwitchingRecommendations = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Switching Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-4 rounded-lg">
          <p className="text-gray-400">Profitability: Bitcoin, Ethereum, Litecoin, Dogecoin, Ripple</p>
        </div>
        <div className="glass-panel p-4 rounded-lg">
          <p className="text-gray-400">Hashrate: Bitcoin, Ethereum, Litecoin, Dogecoin, Ripple</p>
        </div>
        <div className="glass-panel p-4 rounded-lg">
          <p className="text-gray-400">Power Consumption: Bitcoin, Ethereum, Litecoin, Dogecoin, Ripple</p>
        </div>
      </div>
    </div>
  );
};

export default SwitchingRecommendations;