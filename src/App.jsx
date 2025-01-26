import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import Logo from './components/Logo';
import MainContent from './components/MainContent';
import CustomConnectButton from './components/CustomConnectButton';
import Dashboard from './components/Dashboard';
import EngineRoom from './components/EngineRoom'; // Import EngineRoom component
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import RegisterRigPage from './components/RegisterRigPage';
import Sidebar from './components/Sidebar'; // Import Sidebar component
import { DevModeProvider, DevModeToggle } from './context/DevModeContext';
import { getToken, removeToken } from './utils/auth';
import { AuthProvider } from './context/AuthContext'; // Correct import path

const App = () => {
  const [hardwareInfo, setHardwareInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const token = getToken();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <DevModeProvider>
      <WalletProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background overflow-x-hidden">
              {/* Navigation */}
              <nav className="fixed top-0 w-full z-40 glass-panel bg-background/50 h-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-3"
                  >
                    <Link to="/" className="flex items-center space-x-3">
                      <Logo className="w-8 h-8" />
                      <span className="text-2xl font-bold gradient-text">Conan</span>
                    </Link>
                  </motion.div>
                  <HeaderContent />
                </div>
              </nav>

              {/* Main Content */}
              <div className="flex pt-16">
                <MainContentWrapper miningData={hardwareInfo} isOpen={isOpen} setIsOpen={setIsOpen} />
              </div>

              {/* Footer */}
              <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
                <div className="max-w-7xl mx-auto text-center text-gray-400">
                  <p>© 2025 Conan - An aiHash Agent. All rights reserved.</p>
                </div>
              </footer>

              <DevModeToggle />
            </div>
          </Router>
        </AuthProvider>
      </WalletProvider>
    </DevModeProvider>
  );
};

const HeaderContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = getToken();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  // Remove all buttons when on the login page
  if (location.pathname === '/login') {
    return null;
  }

  // Show only the connect wallet button on the dashboard page
  if (location.pathname.startsWith('/dashboard')) {
    return (
      <div className="flex items-center space-x-4">
        <CustomConnectButton />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="neon-button"
        onClick={() => navigate('/dashboard')}
      >
        Dashboard
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="neon-button"
        onClick={() => navigate('/register-rig')}
      >
        Register Rig
      </motion.button>
      <CustomConnectButton />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="neon-button"
        onClick={token ? handleLogout : () => navigate('/login')}
      >
        {token ? 'Logout' : 'Login'}
      </motion.button>
    </div>
  );
};

const MainContentWrapper = ({ miningData, isOpen, setIsOpen }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="flex w-full">
      {isDashboard && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />}
      <div className={`flex-1 p-4 transition-all duration-300 ${isDashboard ? (isOpen ? 'ml-72' : 'ml-20') : ''}`}>
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/dashboard/*" element={<Dashboard miningData={miningData} isOpen={isOpen} setIsOpen={setIsOpen} />} />
          <Route path="/dashboard/engine-room" element={<EngineRoom miningData={miningData} />} /> {/* Define the Engine Room route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register-rig" element={<RegisterRigPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;