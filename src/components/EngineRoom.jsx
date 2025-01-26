import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';

const EngineRoom = () => {
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.coins) {
        const coinsArray = Object.values(data.coins);
        const sortedCoins = coinsArray.sort((a, b) => b.profitability - a.profitability);
        setSortedData(sortedCoins);
        setLoading(false);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    return () => {
      ws.close();
    };
  }, []);

  const getCurrencyIcon = (currency) => {
    switch (currency) {
      case 'BTC':
        return <FaBitcoin className="inline-block ml-1 text-yellow-500" />;
      case 'ETH':
        return <FaEthereum className="inline-block ml-1 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 pt-2"> {/* Reduced top padding */}
      <h2 className="text-2xl font-bold text-white mb-4">Engine Room</h2>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-t-2 border-primary rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading mining data...</p>
            </div>
          </div>
        ) : (
          <table className="min-w-full bg-background-light text-white table-auto border-collapse">
            <thead>
              <tr className="bg-background-lighter">
                <th className="py-2 px-4 text-left uppercase border-b border-gray-700">Coin</th>
                <th className="py-2 px-4 text-left uppercase border-b border-gray-700">Profit</th>
                <th className="py-2 px-4 text-left uppercase border-b border-gray-700">Rewards</th>
                <th className="py-2 px-4 text-left uppercase border-b border-gray-700">Rate</th>
                <th className="py-2 px-4 text-left uppercase border-b border-gray-700">BTC Rev</th>
                <th className="py-2 px-4 text-left uppercase border-b border-gray-700">Algorithm</th>
                <th className="py-2 px-4 text-left uppercase border-b border-gray-700">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((coin) => (
                <tr key={coin.id} className="hover:bg-background-lighter transition-colors border-b border-gray-700">
                  <td className="py-2 px-4">{coin.tag}</td>
                  <td className="py-2 px-4">{coin.profitability}</td>
                  <td className="py-2 px-4">{coin.estimated_rewards}</td>
                  <td className="py-2 px-4">
                    {coin.exchange_rate}
                    {getCurrencyIcon(coin.exchange_rate_curr)}
                  </td>
                  <td className="py-2 px-4">{coin.btc_revenue}</td>
                  <td className="py-2 px-4">{coin.algorithm}</td>
                  <td className="py-2 px-4">{coin.market_cap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EngineRoom;