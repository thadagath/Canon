import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaThermometerHalf, FaBolt, FaMicrochip, FaCoins, FaDollarSign, FaCogs } from 'react-icons/fa';

const formatHashrate = (hashrate) => {
  if (!hashrate || isNaN(hashrate)) return '0.00 H/s';
  if (hashrate >= 1e9) return `${(hashrate / 1e9).toFixed(2)} GH/s`;
  if (hashrate >= 1e6) return `${(hashrate / 1e6).toFixed(2)} MH/s`;
  if (hashrate >= 1e3) return `${(hashrate / 1e3).toFixed(2)} KH/s`;
  return `${hashrate.toFixed(2)} H/s`;
};

const Metric = ({ label, value, unit, icon: Icon, highlight }) => (
  <div className={`text-left ${highlight ? 'text-primary' : 'text-gray-400'} flex items-center space-x-2`}>
    <Icon className="text-xl" />
    <div>
      <p className="text-xs">{label}</p>
      <p className="text-lg font-bold">
        {value}
        {unit && <span className="text-sm ml-1">{unit}</span>}
      </p>
    </div>
  </div>
);

const MiningDashboard = ({ rigData, onOptimize }) => {
  const [totalHashrate, setTotalHashrate] = useState(0);
  const [totalPower, setTotalPower] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);

  useEffect(() => {
    if (rigData?.hardware) {
      const hashrate = rigData.hardware.totalHashrate || 
        (rigData.hardware.gpus?.reduce((sum, gpu) => sum + (gpu.hashrate || 0), 0) || 0);
      const power = rigData.hardware.totalPower || 
        (rigData.hardware.gpus?.reduce((sum, gpu) => sum + (gpu.power || 0), 0) || 0);
      
      setTotalHashrate(hashrate);
      setTotalPower(power);
    }
  }, [rigData]);

  if (!rigData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-t-2 border-primary rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Connecting to mining rig...</p>
        </div>
      </div>
    );
  }

  const connectionDetails = rigData.connectionDetails || {};

  return (
    <motion.div
      className="glass-panel p-4 rounded-lg space-y-4 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <motion.h3
          className="text-lg font-bold text-white gradient-text"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {rigData.name}
        </motion.h3>
        <div className="flex items-center space-x-4">
          <div className="px-2 py-1 rounded-full text-xs bg-primary/20 text-primary flex items-center space-x-1">
            <FaThermometerHalf />
            <span>{rigData.hardware.gpus.reduce((sum, gpu) => sum + gpu.temperature, 0) / rigData.hardware.gpus.length}°C</span>
          </div>
          <div className="px-2 py-1 rounded-full text-xs bg-primary/20 text-primary flex items-center space-x-1">
            <FaBolt />
            <span>{totalPower}W</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            rigData.status === 'online' ? 'bg-green-500/20 text-green-400' :
            rigData.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {rigData.status === 'online' ? '🟢 Active' : '🔴 Inactive'}
          </span>
        </div>
      </div>

      {/* Body Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <Metric label="Hashrate" value={formatHashrate(totalHashrate)} icon={FaMicrochip} />
        <Metric label="Coin" value={rigData.currentCoin || 'Bitcoin'} icon={FaCoins} />
        <Metric label="Profit" value={rigData?.profitability ? `$${(rigData.profitability.btcPerDay * rigData.profitability.usdPrice).toFixed(2)}/day` : '$0.00/day'} icon={FaDollarSign} />
        <Metric label="Algorithm" value={rigData.algorithm || 'SHA-256'} icon={FaCogs} />
      </div>

      {/* Footer Section */}
      <div className="flex justify-between items-center">
        <span className="text-primary cursor-pointer">
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </span>
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${isAutoMode ? 'text-gray-400' : 'text-primary'}`}>Manual</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isAutoMode}
              onChange={() => setIsAutoMode(!isAutoMode)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary peer-checked:bg-primary"></div>
          </label>
          <span className={`text-sm ${isAutoMode ? 'text-primary' : 'text-gray-400'}`}>Auto</span>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* General Info */}
          <div className="glass-panel p-4 rounded-lg">
            <h3 className="text-lg font-bold text-primary mb-2">General Info</h3>
            <p className="text-gray-300">Rig Name/ID: {rigData.name}</p>
            <p className="text-gray-300">IP Address: {connectionDetails.ip || 'N/A'}:{connectionDetails.port || 'N/A'}</p>
            <p className="text-gray-300">Uptime: {rigData.uptime}</p>
            <p className="text-gray-300">Mining Pool: {rigData.miningPool}</p>
          </div>

          {/* Hardware Info */}
          <div className="glass-panel p-4 rounded-lg">
            <h3 className="text-lg font-bold text-primary mb-2">Hardware Info</h3>
            {rigData.hardware.gpus.map((gpu, index) => (
              <div key={index} className="mb-2">
                <p className="text-gray-300">GPU-{index + 1}: {gpu.model} - {formatHashrate(gpu.hashrate)} @ {gpu.temperature}°C, {gpu.power}W</p>
              </div>
            ))}
            <p className="text-gray-300">Total Power Usage: {totalPower}W</p>
          </div>

          {/* Mining Info */}
          <div className="glass-panel p-4 rounded-lg">
            <h3 className="text-lg font-bold text-primary mb-2">Mining Info</h3>
            <p className="text-gray-300">Current Coin: {rigData.currentCoin}</p>
            <p className="text-gray-300">Algorithm: {rigData.algorithm}</p>
            <p className="text-gray-300">Network Difficulty: {rigData.networkDifficulty}</p>
            <p className="text-gray-300">Block Rewards: {rigData.blockRewards}</p>
            <p className="text-gray-300">Estimated Earnings: {rigData.estimatedEarnings}</p>
          </div>

          {/* Profitability Metrics */}
          <div className="glass-panel p-4 rounded-lg">
            <h3 className="text-lg font-bold text-primary mb-2">Profitability Metrics</h3>
            <p className="text-gray-300">Real-time profitability: {rigData.profitability ? `$${(rigData.profitability.btcPerDay * rigData.profitability.usdPrice).toFixed(2)}/day` : '$0.00/day'}</p>
            <p className="text-gray-300">Profitability trend: (Graph placeholder)</p>
          </div>

          {/* Error Logs */}
          <div className="glass-panel p-4 rounded-lg">
            <h3 className="text-lg font-bold text-primary mb-2">Error Logs</h3>
            <p className="text-gray-300">Warnings: {rigData.warnings}</p>
            <p className="text-gray-300">Last Error: {rigData.lastError}</p>
          </div>

          {/* Controls */}
          <div className="glass-panel p-4 rounded-lg">
            <h3 className="text-lg font-bold text-primary mb-2">Controls</h3>
            <div className="flex space-x-4">
              <select className="neon-button">
                <option value="bitcoin">Bitcoin</option>
                <option value="ethereum">Ethereum</option>
              </select>
              <button className="neon-button">Start/Stop Mining</button>
              <button className="neon-button">Reset Rig</button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MiningDashboard;