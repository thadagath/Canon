import React from 'react';

const LoadingOverlay = ({ message }) => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin mx-auto"></div>
      <p className="text-gray-400">{message}</p>
    </div>
  </div>
);

export default LoadingOverlay;