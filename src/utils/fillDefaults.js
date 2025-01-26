export const fillDefaults = (rig) => {
  return {
    rigId: rig._id,
    name: rig.name || 'Unknown Rig',
    status: rig.status || 'offline',
    hardware: {
      gpus: rig.hardware?.gpus || [
        { model: 'Unknown GPU', hashrate: 100, power: 200, temperature: 60, fanSpeed: 50 }
      ],
      totalHashrate: rig.hardware?.totalHashrate || 100,
      totalPower: rig.hardware?.totalPower || 200,
    },
    settings: {
      autoOptimize: rig.settings?.autoOptimize ?? true,
      powerLimit: rig.settings?.powerLimit || 100,
      targetTemperature: rig.settings?.targetTemperature || 70,
    },
    profitability: {
      btcPerDay: rig.profitability?.btcPerDay || 0.0001,
      usdPrice: rig.profitability?.usdPrice || 50000,
    },
    currentCoin: rig.currentCoin || 'Bitcoin',
    algorithm: rig.algorithm || 'SHA-256',
    networkDifficulty: rig.networkDifficulty || 'Medium',
    blockRewards: rig.blockRewards || '6.25 BTC',
    estimatedEarnings: rig.estimatedEarnings || '0.01 BTC/day',
    warnings: rig.warnings || 'None',
    lastError: rig.lastError || 'None',
    connectionDetails: rig.connectionDetails || { ip: '127.0.0.1', port: '3333' },
    uptime: rig.uptime || '24 hours',
    miningPool: rig.miningPool || 'Unknown Pool',
  };
};