import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`fixed top-16 left-0 h-full z-50 transition-all duration-300 ${isOpen ? 'w-64' : 'w-12'}`}>
      <motion.div
        initial={{ width: 48 }}
        animate={{ width: isOpen ? 256 : 48 }}
        className="h-full bg-background-light/80 backdrop-blur-lg p-4 shadow-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <button onClick={toggleSidebar} className="text-white">
            {isOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
          </button>
        </div>
        {isOpen && (
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => navigate('/dashboard')}
              className={`neon-button w-full py-2 ${isActive('/dashboard') ? 'bg-primary/20' : ''}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/dashboard/engine-room')}
              className={`neon-button w-full py-2 ${isActive('/dashboard/engine-room') ? 'bg-primary/20' : ''}`}
            >
              Engine Room
            </button>
            <button
              onClick={() => navigate('/register-rig')}
              className={`neon-button w-full py-2 ${isActive('/register-rig') ? 'bg-primary/20' : ''}`}
            >
              Register Rig
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Sidebar;