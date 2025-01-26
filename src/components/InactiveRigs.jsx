import React, { useState } from 'react';
import axios from 'axios';

const InactiveRigs = ({ rigsWithoutDetails, handleActivate, handleRemove }) => {
  const [loadingRigId, setLoadingRigId] = useState(null);
  const [successRigId, setSuccessRigId] = useState(null);

  const activateRig = async (rigData) => {
    setLoadingRigId(rigData._id);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/rigs/${rigData._id}/activate`, {}, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the request headers
        }
      });

      // Simulate a delay for the loader
      setTimeout(() => {
        setLoadingRigId(null);
        setSuccessRigId(rigData._id);
        setTimeout(() => {
          setSuccessRigId(null);
          handleActivate(rigData._id, { ...rigData, status: 'online' });
        }, 2000);
      }, 2000);
    } catch (error) {
      console.error('Error activating rig:', error);
      setLoadingRigId(null);
    }
  };

  const removeRig = async (rigId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/rigs/${rigId}`, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the request headers
        }
      });
      handleRemove(rigId);
    } catch (error) {
      console.error('Error removing rig:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Inactive Rigs</h2>
      {rigsWithoutDetails.length > 0 ? (
        rigsWithoutDetails.map((rigData, index) => (
          <div key={index} className="glass-panel p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">{rigData.name}</h3>
              <div className="flex space-x-2">
                {loadingRigId === rigData._id ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin w-6 h-6 border-t-2 border-primary rounded-full"></div>
                    <span className="text-gray-400">Activating...</span>
                  </div>
                ) : successRigId === rigData._id ? (
                  <span className="text-green-500">Rig activated!</span>
                ) : (
                  <>
                    <button
                      onClick={() => activateRig(rigData)}
                      className="neon-button"
                    >
                      Activate
                    </button>
                    <button
                      onClick={() => removeRig(rigData._id)}
                      className="neon-button bg-red-500 hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
            <p className="text-gray-400">Last active: {new Date(rigData.lastSeen).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No inactive rigs available.</p>
      )}
    </div>
  );
};

export default InactiveRigs;