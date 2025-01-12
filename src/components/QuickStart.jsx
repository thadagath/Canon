import { motion } from 'framer-motion';
import { CpuChipIcon, BeakerIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const QuickStart = ({ onConnect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Development Mode Banner */}
      <div className="glass-panel p-4 rounded-lg mb-8 border border-primary/30 bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BeakerIcon className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">Development Environment</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-sm text-primary/70">Testing Mode Active</span>
          </div>
        </div>
      </div>

      {/* Quick Start Card */}
      <div className="glass-panel p-8 rounded-lg border-2 border-primary">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <CpuChipIcon className="w-full h-full text-primary animate-pulse" />
          </motion.div>
          <h2 className="text-3xl font-bold gradient-text mb-4">Quick Start Testing</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Test the mining interface with simulated data. No wallet installation required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Connect Section */}
          <div className="space-y-6">
            <div className="bg-primary/5 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">1</span>
                <span>Connect Mock Wallet</span>
              </h3>
              <p className="text-gray-400 mb-6">
                Use a pre-configured wallet to instantly access the mining dashboard.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConnect}
                className="neon-button w-full py-3"
              >
                Start Testing Now
              </motion.button>
            </div>

            <div className="bg-primary/5 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">2</span>
                <span>Monitor Performance</span>
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2 text-gray-400">
                  <ChartBarIcon className="w-5 h-5 text-primary" />
                  <span>Real-time hashrate monitoring</span>
                </li>
                <li className="flex items-center space-x-2 text-gray-400">
                  <ChartBarIcon className="w-5 h-5 text-primary" />
                  <span>Power consumption tracking</span>
                </li>
                <li className="flex items-center space-x-2 text-gray-400">
                  <ChartBarIcon className="w-5 h-5 text-primary" />
                  <span>GPU temperature analysis</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Test Data Info */}
          <div className="space-y-6">
            <div className="bg-primary/5 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Test Environment</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Mock Wallet Address</div>
                  <div className="font-mono text-primary text-sm break-all">
                    0xa2d2de9f820fce6e5d142723c00d905188c34605fb473260033cf21d356a0486
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Simulated Hardware</div>
                  <div className="text-sm text-white">2-4x NVIDIA RTX 3080/3090 GPUs</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Update Frequency</div>
                  <div className="text-sm text-white">Every 5 seconds</div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Test Data Source</span>
                <span className="text-primary">Local Test Rig</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickStart;