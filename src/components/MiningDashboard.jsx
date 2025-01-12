import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const formatHashrate = (hashrate) => {
  if (!hashrate || isNaN(hashrate)) return '0.00 H/s';
  if (hashrate >= 1e9) return `${(hashrate / 1e9).toFixed(2)} GH/s`;
  if (hashrate >= 1e6) return `${(hashrate / 1e6).toFixed(2)} MH/s`;
  if (hashrate >= 1e3) return `${(hashrate / 1e3).toFixed(2)} KH/s`;
  return `${hashrate.toFixed(2)} H/s`;
};

const formatEfficiency = (hashrate, power) => {
  if (!power || power === 0) return '0.00 MH/W';
  const efficiency = (hashrate || 0) / power / 1e6;
  return `${efficiency.toFixed(2)} MH/W`;
};

const MetricCard = ({ label, value, unit, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass-panel p-4 text-center"
  >
    <h3 className="text-gray-400 text-sm">{label}</h3>
    {isLoading ? (
      <div className="h-8 flex items-center justify-center">
        <div className="w-4 h-4 border-t-2 border-primary rounded-full animate-spin"></div>
      </div>
    ) : (
      <p className="text-2xl font-bold text-primary">
        {value}
        {unit && <span className="text-lg ml-1">{unit}</span>}
      </p>
    )}
  </motion.div>
);

const GPUCard = ({ gpu, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="glass-panel p-4 space-y-3"
  >
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-primary">{gpu.model}</h3>
      <span className={`px-2 py-1 rounded-full text-xs ${
        gpu.temperature > 80 ? 'bg-red-500/20 text-red-400' :
        gpu.temperature > 70 ? 'bg-yellow-500/20 text-yellow-400' :
        'bg-green-500/20 text-green-400'
      }`}>
        {gpu.temperature}°C
      </span>
    </div>
    
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div>
        <p className="text-gray-400">Hashrate</p>
        <p className="text-white">{formatHashrate(gpu.hashrate)}</p>
      </div>
      <div>
        <p className="text-gray-400">Power</p>
        <p className="text-white">{gpu.power}W</p>
      </div>
      <div>
        <p className="text-gray-400">Fan Speed</p>
        <p className="text-white">{gpu.fanSpeed}%</p>
      </div>
      <div>
        <p className="text-gray-400">Efficiency</p>
        <p className="text-white">{formatEfficiency(gpu.hashrate, gpu.power)}</p>
      </div>
    </div>

    <div className="flex space-x-2">
      <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${(gpu.power / 300) * 100}%` }}
        />
      </div>
      <span className="text-xs text-gray-400">{Math.round((gpu.power / 300) * 100)}%</span>
    </div>
  </motion.div>
);

const MiningDashboard = ({ rigData, onOptimize }) => {
  const [totalHashrate, setTotalHashrate] = useState(0);
  const [totalPower, setTotalPower] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (rigData?.hardware) {
      setIsLoading(false);
      const hashrate = rigData.hardware.totalHashrate || 
        (rigData.hardware.gpus?.reduce((sum, gpu) => sum + (gpu.hashrate || 0), 0) || 0);
      const power = rigData.hardware.totalPower || 
        (rigData.hardware.gpus?.reduce((sum, gpu) => sum + (gpu.power || 0), 0) || 0);
      
      setTotalHashrate(hashrate);
      setTotalPower(power);
      setEfficiency(power > 0 ? hashrate / power : 0);
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

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          label="Total Hashrate"
          value={formatHashrate(totalHashrate)}
          isLoading={isLoading}
        />
        <MetricCard
          label="Power Consumption"
          value={totalPower}
          unit="W"
          isLoading={isLoading}
        />
        <MetricCard
          label="Efficiency"
          value={formatEfficiency(totalHashrate, totalPower)}
          isLoading={isLoading}
        />
        <MetricCard
          label="Profitability (24h)"
          value={rigData?.profitability ?
            `${rigData.profitability.btcPerDay.toFixed(5)} BTC ($${(rigData.profitability.btcPerDay * rigData.profitability.usdPrice).toFixed(2)})`
            : '0.00000 BTC ($0.00)'}
          isLoading={isLoading}
        />
      </div>

      {/* Status */}
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${
          rigData.status === 'mining' ? 'bg-green-400 animate-pulse' :
          rigData.status === 'online' ? 'bg-blue-400' :
          'bg-red-400'
        }`} />
        <span className="text-sm text-gray-400">
          Status: <span className="text-white capitalize">{rigData.status}</span>
        </span>
      </div>

      {/* GPUs */}
      {rigData.hardware.gpus && rigData.hardware.gpus.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rigData.hardware.gpus.map((gpu, index) => (
            <GPUCard key={index} gpu={gpu} index={index} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-6 text-center">
          <p className="text-gray-400">No GPU data available</p>
        </div>
      )}

      {/* Optimization Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center"
      >
        <button
          onClick={onOptimize}
          className="neon-button"
          disabled={rigData.status !== 'mining'}
        >
          Optimize Performance
        </button>
      </motion.div>
    </div>
  );
};

export default MiningDashboard;