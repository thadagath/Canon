import React from 'react';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';

const CustomConnectButton = () => {
  const wallet = useWallet();

  if (wallet.connected) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 glass-panel px-3 py-1.5 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-gray-300 text-sm font-medium">
            {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
          </span>
        </div>
        <ConnectButton
          label="Disconnect"
          className="text-sm text-primary/70 hover:text-primary transition-colors"
        />
      </div>
    );
  }

  return (
    <ConnectButton className="neon-button">
      Connect Wallet
    </ConnectButton>
  );
};

export default CustomConnectButton;