import React from 'react';
import MiningDashboard from './MiningDashboard';

const sampleRigData = [
  {
    id: 'rig-1',
    name: 'Mining Rig 1',
    status: 'mining',
    hardware: {
      gpus: [
        { model: 'RTX 4090', hashrate: 150000000, power: 300, temperature: 65, fanSpeed: 70 },
        { model: 'RTX 4080', hashrate: 120000000, power: 250, temperature: 62, fanSpeed: 65 }
      ],
      totalHashrate: 270000000,
      totalPower: 550
    },
    settings: {
      autoOptimize: true,
      powerLimit: 80,
      targetTemperature: 70
    },
    profitability: {
      btcPerDay: 0.00045,
      usdPrice: 43250
    }
  },
  {
    id: 'rig-2',
    name: 'Mining Rig 2',
    status: 'online',
    hardware: {
      gpus: [
        { model: 'RTX 3080', hashrate: 95000000, power: 220, temperature: 70, fanSpeed: 75 },
        { model: 'RTX 3070', hashrate: 75000000, power: 200, temperature: 68, fanSpeed: 70 }
      ],
      totalHashrate: 170000000,
      totalPower: 420
    },
    settings: {
      autoOptimize: true,
      powerLimit: 80,
      targetTemperature: 70
    },
    profitability: {
      btcPerDay: 0.00030,
      usdPrice: 43250
    }
  },
  {
    id: 'rig-3',
    name: 'Mining Rig 3',
    status: 'paused',
    hardware: {
      gpus: [
        { model: 'RTX 3060', hashrate: 60000000, power: 180, temperature: 60, fanSpeed: 60 },
        { model: 'RTX 3050', hashrate: 50000000, power: 150, temperature: 58, fanSpeed: 55 }
      ],
      totalHashrate: 110000000,
      totalPower: 330
    },
    settings: {
      autoOptimize: true,
      powerLimit: 80,
      targetTemperature: 70
    },
    profitability: {
      btcPerDay: 0.00020,
      usdPrice: 43250
    }
  },
  {
    id: 'rig-4',
    name: 'Mining Rig 4',
    status: 'offline',
    hardware: {
      gpus: [
        { model: 'RTX 3090', hashrate: 100000000, power: 250, temperature: 75, fanSpeed: 80 },
        { model: 'RTX 3080 Ti', hashrate: 90000000, power: 230, temperature: 72, fanSpeed: 75 }
      ],
      totalHashrate: 190000000,
      totalPower: 480
    },
    settings: {
      autoOptimize: true,
      powerLimit: 80,
      targetTemperature: 70
    },
    profitability: {
      btcPerDay: 0.00035,
      usdPrice: 43250
    }
  }
];

const Dashboard = () => {
  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-12">
      {sampleRigData.map((rigData, index) => (
        <MiningDashboard key={index} rigData={rigData} onOptimize={() => {}} />
      ))}
    </div>
  );
};

export default Dashboard;