const WebSocket = require('ws');
const os = require('os');

class MiningRigClient {
  constructor(serverUrl, rigConfig) {
    this.serverUrl = serverUrl;
    this.rigConfig = rigConfig;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 5000; // 5 seconds
  }

  connect() {
    console.log('Connecting to mining server...');
    this.ws = new WebSocket(this.serverUrl);

    this.ws.on('open', () => {
      console.log('Connected to server');
      this.reconnectAttempts = 0;
      this.register();
      this.startMetricsReporting();
    });

    this.ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        this.handleServerMessage(message);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    this.ws.on('close', () => {
      console.log('Connection closed');
      this.handleDisconnect();
    });

    this.ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.handleDisconnect();
    });
  }

  register() {
    const registrationData = {
      type: 'register',
      owner: this.rigConfig.owner,
      name: this.rigConfig.name,
      connectionDetails: {
        ip: this.getLocalIp(),
        protocol: 'stratum2',
      },
    };

    this.send(registrationData);
  }

  startMetricsReporting() {
    // Simulate metrics reporting every 30 seconds
    this.metricsInterval = setInterval(() => {
      const metrics = this.collectMetrics();
      this.send({
        type: 'metrics',
        metrics,
      });
    }, 30000);
  }

  collectMetrics() {
    // Simulate collecting GPU metrics
    // In a real implementation, this would use a GPU monitoring library
    return {
      gpus: [
        {
          model: 'NVIDIA RTX 3080',
          temperature: Math.floor(60 + Math.random() * 20),
          fanSpeed: Math.floor(50 + Math.random() * 40),
          hashrate: 95000000 + Math.random() * 5000000, // ~95 MH/s
          power: 220 + Math.random() * 30,
          memory: 10000,
          core: 1500,
        },
        // Add more GPUs as needed
      ],
      totalHashrate: 95000000,
      totalPower: 220,
    };
  }

  handleServerMessage(message) {
    switch (message.type) {
      case 'registered':
        console.log('Registration successful. Rig ID:', message.rigId);
        break;

      case 'optimize':
        console.log('Received optimization recommendations:', message.recommendations);
        this.applyOptimizations(message.recommendations);
        break;

      case 'settings':
        console.log('Received settings update:', message.settings);
        this.updateSettings(message.settings);
        break;

      case 'error':
        console.error('Server error:', message.message);
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }

  applyOptimizations(recommendations) {
    // In a real implementation, this would apply the recommended settings to the GPUs
    console.log('Applying optimizations:', recommendations);
    Object.entries(recommendations).forEach(([gpuId, recommendation]) => {
      if (recommendation.type === 'temperature') {
        console.log(`Adjusting power for ${gpuId} by ${recommendation.value}%`);
      } else if (recommendation.type === 'efficiency') {
        console.log(`Optimizing settings for ${gpuId}:`, recommendation.suggestions);
      }
    });
  }

  updateSettings(settings) {
    // In a real implementation, this would update the mining software settings
    console.log('Updating rig settings:', settings);
    this.rigConfig = {
      ...this.rigConfig,
      settings,
    };
  }

  handleDisconnect() {
    clearInterval(this.metricsInterval);

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      setTimeout(() => this.connect(), this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached. Please check your connection.');
    }
  }

  getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const interface of interfaces[name]) {
        if (interface.family === 'IPv4' && !interface.internal) {
          return interface.address;
        }
      }
    }
    return 'unknown';
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    if (this.ws) {
      clearInterval(this.metricsInterval);
      this.ws.close();
    }
  }
}

// Example usage:
const rigConfig = {
  owner: '0xa2d2de9f820fce6e5d142723c00d905188c34605fb473260033cf21d356a0486', // Owner's wallet address
  name: 'Mining Rig 1',
  settings: {
    autoOptimize: true,
    powerLimit: 80,
    targetTemperature: 70,
  },
};

// Create and connect the client
const client = new MiningRigClient('ws://localhost:5000', rigConfig);
client.connect();

// Handle process termination
process.on('SIGINT', () => {
  console.log('Disconnecting from server...');
  client.disconnect();
  process.exit(0);
});

module.exports = MiningRigClient;