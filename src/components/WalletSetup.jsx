import { motion } from 'framer-motion';
import { useDevMode } from '../context/DevModeContext';
import QuickStart from './QuickStart';

const WalletSetup = ({ onConnect }) => {
  const { isDevMode, mockWallet } = useDevMode();

  if (isDevMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="glass-panel p-4 rounded-lg mb-8 border border-primary/30 bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-primary font-medium">Development Environment Active</span>
            </div>
            <span className="text-sm text-primary/70">Testing Mode</span>
          </div>
        </div>
        
        <QuickStart onConnect={() => mockWallet?.connect()} />
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6"
      >
        <h2 className="text-2xl font-bold mb-4 gradient-text">Get Started with Mining</h2>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              1
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Install Sui Wallet</h3>
              <p className="text-gray-400 mb-4">
                Install the Sui Wallet extension to connect your mining rig and manage your earnings.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConnect}
                className="neon-button text-sm"
              >
                Install Sui Wallet
              </motion.button>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              2
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-gray-400">
                After installation, connect your wallet to start mining and earning rewards.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Why Use Sui Wallet?</h3>
        <ul className="space-y-3 text-gray-400">
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span>Secure management of mining rewards</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span>Direct integration with mining platform</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span>Easy access to optimization features</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span>Real-time performance monitoring</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default WalletSetup;