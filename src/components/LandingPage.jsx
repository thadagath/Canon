import { motion } from 'framer-motion';
import { BoltIcon, CurrencyDollarIcon, ChartBarIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import Logo from './Logo';

const StatCard = ({ icon: Icon, title, value, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-panel p-6 space-y-4"
  >
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    <p className="text-3xl font-bold gradient-text">{value}</p>
    <p className="text-gray-400 text-sm">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 mb-16"
      >
        <div className="flex justify-center mb-8">
          <Logo className="w-24 h-24" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
          Welcome to Conan
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          aiHash next generation AI-powered mining optimization platform. Maximize your earnings with intelligent hardware management and real-time analytics.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        <StatCard
          icon={CpuChipIcon}
          title="Processing Power"
          value="2.5 TH/s"
          description="Total network hashrate"
        />
        <StatCard
          icon={BoltIcon}
          title="Power Saved"
          value="45%"
          description="Average power optimization"
        />
        <StatCard
          icon={CurrencyDollarIcon}
          title="Daily Earnings"
          value="$2.5M+"
          description="Network-wide daily profits"
        />
        <StatCard
          icon={ChartBarIcon}
          title="Active Miners"
          value="10,000+"
          description="Miners using Conan"
        />
      </div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-24 text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-8">Why Choose Conan?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BoltIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Smart Optimization</h3>
            <p className="text-gray-400">AI-driven performance tuning for maximum efficiency</p>
          </div>
          <div className="glass-panel p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ChartBarIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Analytics</h3>
            <p className="text-gray-400">Comprehensive insights into your mining operation</p>
          </div>
          <div className="glass-panel p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CurrencyDollarIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Profit Maximization</h3>
            <p className="text-gray-400">Automated strategies to increase your earnings</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;