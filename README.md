# aiHash - AI-Powered Mining Optimization

A decentralized AI agent for cryptocurrency mining optimization with real-time analytics, Web3 integration, and futuristic design.

## Setup Instructions

### Prerequisites

1. Node.js (v16 or higher)
2. Sui Wallet Extension
3. MongoDB (optional, uses in-memory storage for development)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd ai-optimizer-conan
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. Install Sui Wallet:
- Visit the [Chrome Web Store](https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil)
- Install the Sui Wallet extension
- Create a new wallet or import existing one
- Switch to devnet for testing

### Configuration

1. Create environment files:
```bash
# In the server directory
cp .env.example .env
```

2. Start the development servers:
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from root directory)
npm run dev
```

## Connecting Your Mining Rig

### Option 1: Using Sample Client

1. Install dependencies:
```bash
cd server
npm install ws
```

2. Run the sample client:
```bash
node src/examples/rig-client.js
```

### Option 2: Direct Integration

Integrate with our WebSocket API:

1. Connect to WebSocket server:
```javascript
const ws = new WebSocket('ws://localhost:5000');
```

2. Register your rig:
```javascript
ws.send(JSON.stringify({
  type: 'register',
  owner: 'your_wallet_address',
  name: 'rig_name',
  connectionDetails: {
    ip: 'your_ip',
    protocol: 'stratum2'
  }
}));
```

3. Send metrics:
```javascript
ws.send(JSON.stringify({
  type: 'metrics',
  metrics: {
    gpus: [{
      model: 'GPU_MODEL',
      temperature: 65,
      fanSpeed: 70,
      hashrate: 95000000,
      power: 220,
      memory: 10000,
      core: 1500
    }],
    totalHashrate: 95000000,
    totalPower: 220
  }
}));
```

## Testing

1. Start both frontend and backend servers
2. Open http://localhost:5175 in your browser
3. Connect your Sui Wallet
4. Start the sample mining client
5. Monitor real-time updates and optimizations

## Features

- Real-time mining analytics
- AI-driven optimization
- Hardware monitoring
- Power consumption optimization
- Thermal management
- Web3 integration
- Decentralized infrastructure
- Modern, futuristic UI

## Development Mode Features

- In-memory database for quick testing
- Real-time WebSocket communication
- Simulated mining metrics
- Automatic optimization recommendations

## Production Deployment

For production deployment:

1. Update MongoDB connection in server/.env
2. Configure proper security measures
3. Set up SSL/TLS for WebSocket connections
4. Deploy frontend to static hosting
5. Deploy backend to Node.js hosting

## Security Considerations

1. Always use secure WebSocket connections (WSS) in production
2. Implement proper wallet signature verification
3. Rate limit API requests
4. Monitor for suspicious activities
5. Keep all dependencies updated

## Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Contact support@aihash.com

## License

MIT License - see LICENSE file for details
