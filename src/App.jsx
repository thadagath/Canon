import { motion } from 'framer-motion';
import { WalletProvider, ConnectButton, useWallet } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import { ChartBarIcon, CubeTransparentIcon, BoltIcon } from '@heroicons/react/24/outline';
import Logo from './components/Logo';
import { useState, useEffect } from 'react';
import MiningDashboard from './components/MiningDashboard';
import WalletSetup from './components/WalletSetup';
import LandingPage from './components/LandingPage';
import { DevModeProvider, useDevMode, useMockableWallet, DevModeToggle } from './context/DevModeContext';

const LoadingOverlay = ({ message }) => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin mx-auto"></div>
      <p className="text-gray-400">{message}</p>
    </div>
  </div>
);

const MainContent = () => {
  const [isMining, setIsMining] = useState(false);
  const [rigStatus, setRigStatus] = useState(null);
  const [rigData, setRigData] = useState(null);
  const [ws, setWs] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const realWallet = useWallet();
  const wallet = useMockableWallet(realWallet);
  const { isDevMode } = useDevMode();

  useEffect(() => {
    if (isDevMode) {
      // Use mock data in development mode
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

    if (wallet.connected && !ws) {
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
  }, [wallet.connected, isDevMode]);

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
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 glass-panel bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <div className="flex items-center space-x-3">
                <Logo className="w-8 h-8" />
                <span className="text-2xl font-bold gradient-text">Conan</span>
              </div>
            </motion.div>
            <CustomConnectButton />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 sm:pt-32">
        {!wallet.connected && !isDevMode ? (
          <>
            <LandingPage />
            <div className="px-4 sm:px-6 lg:px-8">
              <WalletSetup onConnect={() => {}} />
            </div>
          </>
        ) : (
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

            {!isConnecting && !rigStatus && !isDevMode && (
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
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2025 Conan - An aiHash Agent. All rights reserved.</p>
        </div>
      </footer>

      <DevModeToggle />
    </div>
  );
};

const CustomConnectButton = () => {
  const wallet = useWallet();
  
  if (wallet.connected) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 glass-panel px-3 py-1.5 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-gray-300 text-sm font-medium">
            {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
          </span>
        </div>
        <ConnectButton 
          label="Disconnect"
          className="text-sm text-primary/70 hover:text-primary transition-colors"
        />
      </div>
    );
  }
  
  return (
    <ConnectButton className="neon-button">
      Connect Wallet
    </ConnectButton>
  );
};

function App() {
  return (
    <DevModeProvider>
      <WalletProvider>
        <MainContent />
      </WalletProvider>
    </DevModeProvider>
  );
}

export default App;