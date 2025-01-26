import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingOverlay from './LoadingOverlay';

const RegisterRigPage = () => {
  const [rigName, setRigName] = useState('');
  const [rigIP, setRigIP] = useState('');
  const [port, setPort] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      name: rigName,
      connectionDetails: {
        ip: rigIP,
        port: parseInt(port, 10)
      }
    };

    console.log('Payload:', payload); // Log the payload for debugging

    try {
      const token = localStorage.getItem('token'); // Get the token from local storage
      const response = await axios.post('/api/rigs/register', payload, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the request headers
        }
      });
      setIsLoading(false);
      navigate('/dashboard', { state: { rig: response.data } });
    } catch (error) {
      setIsLoading(false);
      console.error('Error registering rig:', error.response?.data || error.message);
      alert('Failed to connect to rig');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {isLoading && <LoadingOverlay message="Registering Rig..." />}
      <div className="glass-panel p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-6">Register Rig</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Rig Name</label>
            <input
              type="text"
              value={rigName}
              onChange={(e) => setRigName(e.target.value)}
              className="w-full p-2 rounded-lg bg-background-light text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Rig IP</label>
            <input
              type="text"
              value={rigIP}
              onChange={(e) => setRigIP(e.target.value)}
              className="w-full p-2 rounded-lg bg-background-light text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Port</label>
            <input
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-full p-2 rounded-lg bg-background-light text-white"
              required
            />
          </div>
          <button type="submit" className="neon-button w-full py-2">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterRigPage;