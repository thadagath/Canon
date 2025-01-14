import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CpuChipIcon } from '@heroicons/react/24/outline';
import { useWallet } from '@suiet/wallet-kit';
import MiningDashboard from './MiningDashboard';
import WalletSetup from './WalletSetup';
import LandingPage from './LandingPage';
import { useDevMode, useMockableWallet } from '../context/DevModeContext';

const MainContent = () => {
  const [isMining, setIsMining] = useState(false);
  const [rigStatus, setRigStatus] = useState(null);
  const [rigData, setRigData] = useState(null);
  const [ws, setWs] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [shouldConnectToRig, setShouldConnectToRig] = useState(false);
  const realWallet = useWallet();
  const wallet = useMockableWallet(realWallet);
  const { isDevMode } = useDevMode();

  useEffect(() => {
    if (isDevMode) {
      setRigStatus('connected');
      setRigData({
        id: 'dev-rig',
        name: 'Development Rig',
        status: 'mining',
        hardware: {
          gpus: [
            { name: 'RTX 4090', hashrate: 150000000, power: 300, temperature: 65 },
            { name: 'RTX 4080', hashrate: 120000000, power: 250, temperature: 62 }
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
      });
      setIsMining(true);
      return;
    }

    if (wallet.connected && shouldConnectToRig && !ws) {
      setIsConnecting(true);
      const socket = new WebSocket('ws://localhost:5000');

      socket.onopen = () => {
        console.log('Connected to mining server');
        socket.send(JSON.stringify({
          type: 'register',
          owner: wallet.address,
          name: 'Web Client',
          connectionDetails: {
            ip: 'web-client',
            protocol: 'stratum2'
          }
        }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received:', data);
        if (data.type === 'registered') {
          setRigStatus('connected');
          setIsConnecting(false);
        } else if (data.type === 'rig_update') {
          setRigData(data.rig);
          setRigStatus(data.rig.status);
          setIsMining(data.rig.status === 'mining');
        }
      };

      socket.onclose = () => {
        console.log('Disconnected from mining server');
        setRigStatus(null);
        setWs(null);
        setIsConnecting(false);
      };

      setWs(socket);
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [wallet.connected, shouldConnectToRig, isDevMode]);

  const handleStartMining = () => {
    if (!wallet.connected) {
      alert("Please connect your wallet first");
      return;
    }
    if (!ws) {
      alert("Please wait for server connection");
      return;
    }
    setIsMining(true);
    ws.send(JSON.stringify({
      type: 'status',
      status: 'mining'
    }));
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="pt-24 sm:pt-32">
        {true ? (
          <>
            <LandingPage />
            <div className="px-4 sm:px-6 lg:px-8">
              <WalletSetup onConnect={() => {}} />
            </div>
          </>
        ) 
        : (
          <div className="px-4 sm:px-6 lg:px-8">
            {isConnecting && !isDevMode && (
              <div className="text-center py-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="w-16 h-16 mx-auto">
                    <CpuChipIcon className="w-full h-full text-primary animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Connecting to Mining Rig</h2>
                  <p className="text-gray-400">Please wait while we establish connection...</p>
                </motion.div>
              </div>
            )}

            {(!isConnecting && (rigStatus === 'connected' || rigStatus === 'mining')) || isDevMode ? (
              <MiningDashboard
                rigData={rigData}
                onOptimize={handleStartMining}
              />
            ) : null}

            {/* {!isConnecting && !rigStatus && !isDevMode && (
              <div className="text-center py-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="w-16 h-16 mx-auto">
                    <CpuChipIcon className="w-full h-full text-primary/50" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">No Mining Rig Connected</h2>
                  <p className="text-gray-400">Please check your connection and try again.</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.reload()}
                    className="neon-button mt-4"
                  >
                    Retry Connection
                  </motion.button>
                </motion.div>
              </div>
            )} */}

            {/* {wallet.connected && !shouldConnectToRig && (
              <div className="text-center mt-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="neon-button"
                  onClick={() => setShouldConnectToRig(true)}
                >
                  Connect Rig
                </motion.button>
              </div>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;