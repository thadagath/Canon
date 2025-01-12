import { createContext, useContext, useState } from 'react';

const DevModeContext = createContext({
  isDevMode: false,
  toggleDevMode: () => {},
  mockWallet: null,
});

export const DevModeProvider = ({ children }) => {
  const [isDevMode, setIsDevMode] = useState(false);
  const [mockWallet, setMockWallet] = useState(null);

  const toggleDevMode = () => {
    if (!isDevMode) {
      // Create mock wallet when enabling dev mode
      setMockWallet({
        connected: true,
        address: '0xa2d2de9f820fce6e5d142723c00d905188c34605fb473260033cf21d356a0486',
        disconnect: () => {
          setMockWallet(prev => ({ ...prev, connected: false }));
        },
        connect: () => {
          setMockWallet(prev => ({ ...prev, connected: true }));
        },
      });
    } else {
      // Clear mock wallet when disabling dev mode
      setMockWallet(null);
    }
    setIsDevMode(!isDevMode);
  };

  return (
    <DevModeContext.Provider value={{ isDevMode, toggleDevMode, mockWallet }}>
      {children}
    </DevModeContext.Provider>
  );
};

export const useDevMode = () => {
  const context = useContext(DevModeContext);
  if (context === undefined) {
    throw new Error('useDevMode must be used within a DevModeProvider');
  }
  return context;
};

// Mock wallet hook that combines real and mock wallet functionality
export const useMockableWallet = (realWallet) => {
  const { isDevMode, mockWallet } = useDevMode();
  
  if (isDevMode && mockWallet) {
    return mockWallet;
  }
  
  return realWallet;
};

// Development mode toggle button component
export const DevModeToggle = () => {
  const { isDevMode, toggleDevMode } = useDevMode();
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
      {isDevMode && (
        <div className="glass-panel p-2 rounded-lg mb-2 max-w-xs">
          <div className="flex items-center space-x-2 text-xs text-primary mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            <span>Development Environment Active</span>
          </div>
          <p className="text-xs text-gray-400">
            Using simulated mining data for testing
          </p>
        </div>
      )}
      <button
        onClick={toggleDevMode}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          isDevMode
            ? 'neon-button'
            : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-800 hover:border-gray-600'
        }`}
      >
        <div className="flex items-center space-x-2">
          {isDevMode ? (
            <>
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Development Mode</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-gray-600"></span>
              <span>Switch to Dev Mode</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};