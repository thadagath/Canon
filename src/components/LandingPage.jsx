import React from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from './ParticleBackground';
import { useWallet } from '@suiet/wallet-kit';
import { useAuth } from '../context/AuthContext'; // Correct import path
import Logo from './Logo'; // Import the Conan logo component

const LandingPage = ({ onConnectWallet }) => {
  const { isConnected } = useWallet();
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 text-center px-6">
        <div className="flex items-center justify-center gap-2 text-4xl font-bold mb-8">
          <Logo className="w-12 h-12" /> {/* Use the Conan logo */}
          <span className="bg-gradient-to-r from-[#00FF9D] to-[#2D7FF9] text-transparent bg-clip-text">
            Conan
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00FF9D] to-[#2D7FF9] text-transparent bg-clip-text leading-tight">
          Welcome to Conan: <br />
          The Future of Crypto Mining Intelligence
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Conan is not just an application; it’s your ultimate AI-powered mining companion designed to revolutionize the way you mine cryptocurrency. With cutting-edge intelligence and advanced decision-making capabilities, Conan optimizes every aspect of the mining process, empowering miners to achieve unmatched efficiency and profitability.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isConnected ? (
            <Link 
              to="/dashboard"
              className="bg-[#00FF9D] text-[#0D1117] px-8 py-3 rounded-lg font-medium hover:bg-[#00FF9D]/90 transition-colors"
            >
              Launch App
            </Link>
          ) : (
            <button
              onClick={onConnectWallet}
              className="bg-[#00FF9D] text-[#0D1117] px-8 py-3 rounded-lg font-medium hover:bg-[#00FF9D]/90 transition-colors"
            >
              {user ? 'Connect Wallet' : 'Get Started'}
            </button>
          )}
          <Link
            to="/docs"
            className="border border-[#00FF9D] text-[#00FF9D] px-8 py-3 rounded-lg font-medium hover:bg-[#00FF9D]/10 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;