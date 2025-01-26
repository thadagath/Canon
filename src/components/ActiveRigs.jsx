import React from 'react';
import MiningDashboard from './MiningDashboard';

const ActiveRigs = React.memo(({ rigsWithDetails }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Active Rigs</h2>
      {rigsWithDetails.length > 0 ? (
        rigsWithDetails.map((rigData, index) => (
          <MiningDashboard key={index} rigData={rigData} onOptimize={() => {}} />
        ))
      ) : (
        <p className="text-gray-400">No active rigs available.</p>
      )}
    </div>
  );
});

export default ActiveRigs;