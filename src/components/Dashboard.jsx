import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import GlobalStats from './GlobalStats';
import { fillDefaults } from '../utils/fillDefaults'; // Import the utility function
const ActiveRigs = React.lazy(() => import('./ActiveRigs'));
const InactiveRigs = React.lazy(() => import('./InactiveRigs'));
const ProfitabilityGraphs = React.lazy(() => import('./ProfitabilityGraphs'));
const SwitchingRecommendations = React.lazy(() => import('./SwitchingRecommendations'));

const hardcodedRigs = [
  fillDefaults({
    _id: 'hardcoded-rig-1',
    name: 'Hardcoded Rig 1',
    status: 'online',
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
    },
    currentCoin: 'Bitcoin',
    algorithm: 'SHA-256',
    networkDifficulty: 'Medium',
    blockRewards: '6.25 BTC',
    estimatedEarnings: '0.01 BTC/day',
    warnings: 'None',
    lastError: 'None',
    connectionDetails: { ip: '127.0.0.1', port: '3333' },
    uptime: '24 hours',
    miningPool: 'Unknown Pool',
  }),
  fillDefaults({
    _id: 'hardcoded-rig-2',
    name: 'Hardcoded Rig 2',
    status: 'paused',
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
    },
    currentCoin: 'Ethereum',
    algorithm: 'Ethash',
    networkDifficulty: 'High',
    blockRewards: '2 ETH',
    estimatedEarnings: '0.02 ETH/day',
    warnings: 'None',
    lastError: 'None',
    connectionDetails: { ip: '127.0.0.1', port: '3333' },
    uptime: '12 hours',
    miningPool: 'Unknown Pool',
  })
];

const Dashboard = ({ miningData }) => {
  const [rigs, setRigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRigs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/rigs', {
          headers: {
            Authorization: `Bearer ${token}` // Include the token in the request headers
          }
        });
        setRigs([...response.data.map(fillDefaults), ...hardcodedRigs]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching rigs:', error);
        setRigs(hardcodedRigs); // Fallback to hardcoded rigs if fetching fails
        setIsLoading(false);
      }
    };

    fetchRigs();
  }, []);

  const handleActivate = (rigId, data) => {
    setRigs((prevRigs) => {
      const updatedRigs = prevRigs.map((rig) => {
        if (rig._id === rigId) {
          return fillDefaults({ ...rig, ...data, status: 'online' });
        }
        return rig;
      });
      return updatedRigs;
    });
  };

  const handleRemove = (rigId) => {
    setRigs(prevRigs => prevRigs.filter(rig => rig._id !== rigId));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-t-2 border-primary rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading rigs...</p>
        </div>
      </div>
    );
  }

  const rigsWithDetails = rigs.filter(rig => rig.hardware && rig.hardware.gpus.length > 0 && rig.status === 'online');
  const rigsWithoutDetails = rigs.filter(rig => !rig.hardware || rig.hardware.gpus.length === 0 || rig.status !== 'online');

  const totalActiveRigs = rigsWithDetails.length;
  const combinedHashrate = rigsWithDetails.reduce((sum, rig) => sum + rig.hardware.totalHashrate, 0);
  const totalEarningsBTC = rigsWithDetails.reduce((sum, rig) => sum + (rig.profitability.btcPerDay || 0), 0);
  const totalEarningsUSD = totalEarningsBTC * (rigsWithDetails[0]?.profitability.usdPrice || 0);

  return (
    <div className="space-y-6 pt-10 px-4 md:px-8 lg:px-12 overflow-x-hidden"> {/* Added padding to prevent overflow */}
      {/* Top Section: Global Stats */}
      <GlobalStats
        totalActiveRigs={totalActiveRigs}
        combinedHashrate={combinedHashrate}
        totalEarningsBTC={totalEarningsBTC}
        totalEarningsUSD={totalEarningsUSD}
      />

      {/* Middle Section: Active and Inactive Rigs */}
      <Suspense fallback={<div>Loading...</div>}>
        <ActiveRigs rigsWithDetails={rigsWithDetails} />
        <InactiveRigs
          rigsWithoutDetails={rigsWithoutDetails}
          handleActivate={handleActivate}
          handleRemove={handleRemove}
        />
      </Suspense>

      {/* Bottom Section: Profitability Graphs and Switching Recommendations */}
      <Suspense fallback={<div>Loading...</div>}>
        <ProfitabilityGraphs />
        <SwitchingRecommendations />
      </Suspense>
    </div>
  );
};

export default Dashboard;