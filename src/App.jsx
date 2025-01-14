import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import Logo from './components/Logo';
import MainContent from './components/MainContent';
import CustomConnectButton from './components/CustomConnectButton';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { DevModeProvider, DevModeToggle } from './context/DevModeContext';
import { setAuthToken, getToken, removeToken } from './utils/auth';

const App = () => {
  useEffect(() => {
    const token = getToken();
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <DevModeProvider>
      <WalletProvider>
        <Router>
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
                    <Link to="/" className="flex items-center space-x-3">
                      <Logo className="w-8 h-8" />
                      <span className="text-2xl font-bold gradient-text">Conan</span>
                    </Link>
                  </motion.div>
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="neon-button"
                    >
                      <Link to="/dashboard">Dashboard</Link>
                    </motion.button>
                    <CustomConnectButton />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="neon-button"
                      onClick={() => {
                        removeToken();
                        window.location.href = '/login';
                      }}
                    >
                      Logout
                    </motion.button>
                  </div>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <MainContentWrapper />

            {/* Footer */}
            <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
              <div className="max-w-7xl mx-auto text-center text-gray-400">
                <p>© 2025 Conan - An aiHash Agent. All rights reserved.</p>
              </div>
            </footer>

            <DevModeToggle />
          </div>
        </Router>
      </WalletProvider>
    </DevModeProvider>
  );
};

const MainContentWrapper = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token && location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div className={isLandingPage ? '' : 'pt-24 sm:pt-32'}>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
};

export default App;