export const SUPPORTED_WALLETS = [
  {
    id: 'sui',
    name: 'Sui Wallet',
    icon: '🔷',
    checkAvailability: () => typeof window !== 'undefined' && window.suiWallet,
    connect: async () => {
      const response = await window.suiWallet.requestPermissions();
      if (response.granted) {
        const accounts = await window.suiWallet.getAccounts();
        return { address: accounts[0], walletId: 'sui' };
      }
      throw new Error('Permission denied');
    }
  },
  {
    id: 'ethos',
    name: 'Ethos Wallet',
    icon: '💎',
    checkAvailability: () => typeof window !== 'undefined' && window.ethosWallet,
    connect: async () => {
      const response = await window.ethosWallet.connect();
      return { address: response.address, walletId: 'ethos' };
    }
  },
  {
    id: 'suiet',
    name: 'Suiet Wallet',
    icon: '🌟',
    checkAvailability: () => typeof window !== 'undefined' && window.suietWallet,
    connect: async () => {
      const response = await window.suietWallet.connect();
      return { address: response.address, walletId: 'suiet' };
    }
  }
];