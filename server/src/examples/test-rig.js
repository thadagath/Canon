const WebSocket = require('ws');

// Configuration
const config = {
  serverUrl: 'ws://localhost:5000',
  owner: '0xa2d2de9f820fce6e5d142723c00d905188c34605fb473260033cf21d356a0486',
  rigName: 'Test Rig 1',
  updateInterval: 5000, // 5 seconds
};

// GPU Models with their base characteristics
const GPU_MODELS = [
  {
    name: 'NVIDIA RTX 3080',
    baseHashrate: 95000000, // 95 MH/s
    basePower: 220, // 220W
    baseTemp: 65, // 65°C
  },
  {
    name: 'NVIDIA RTX 3090',
    baseHashrate: 120000000, // 120 MH/s
    basePower: 290, // 290W
    baseTemp: 68, // 68°C
  },
  {
    name: 'AMD RX 6800 XT',
    baseHashrate: 85000000, // 85 MH/s
    basePower: 200, // 200W
    baseTemp: 62, // 62°C
  },
];

class TestRig {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.isMining = false;
    this.gpus = this.initializeGPUs();
  }

  initializeGPUs() {
    // Create 2-4 random GPUs
    const gpuCount = 2 + Math.floor(Math.random() * 3);
    return Array.from({ length: gpuCount }, () => {
      const model = GPU_MODELS[Math.floor(Math.random() * GPU_MODELS.length)];
      return {
        model: model.name,
        baseHashrate: model.baseHashrate,
        basePower: model.basePower,
        baseTemp: model.baseTemp,
        currentTemp: model.baseTemp,
        fanSpeed: 60,
        memory: 0,
        core: 0,
      };
    });
  }

  connect() {
    console.log('Connecting to mining server...');
    this.ws = new WebSocket(config.serverUrl);

    this.ws.on('open', () => {
      console.log('Connected to server');
      this.isConnected = true;
      this.register();
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
      console.log('Disconnected from server');
      this.isConnected = false;
      this.reconnect();
    });

    this.ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  register() {
    const registration = {
      type: 'register',
      owner: config.owner,
      name: config.rigName,
      connectionDetails: {
        ip: '127.0.0.1',
        protocol: 'stratum2',
      },
    };

    this.send(registration);
  }

  startMining() {
    this.isMining = true;
    this.send({
      type: 'status',
      status: 'mining',
    });
    this.startMetricsReporting();
  }

  stopMining() {
    this.isMining = false;
    this.send({
      type: 'status',
      status: 'online',
    });
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
  }

  startMetricsReporting() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }

    this.metricsInterval = setInterval(() => {
      const metrics = this.generateMetrics();
      this.send({
        type: 'metrics',
        metrics,
      });
    }, config.updateInterval);
  }

  generateMetrics() {
    const gpuMetrics = this.gpus.map(gpu => {
      // Add some random fluctuation
      const hashrateFactor = 0.95 + Math.random() * 0.1; // ±5%
      const powerFactor = 0.98 + Math.random() * 0.04; // ±2%
      const tempChange = -2 + Math.random() * 4; // ±2°C

      // Update current temperature with some inertia
      gpu.currentTemp = gpu.currentTemp * 0.8 + (gpu.baseTemp + tempChange) * 0.2;
      
      // Adjust fan speed based on temperature
      gpu.fanSpeed = Math.min(100, Math.max(30, 
        Math.floor(40 + (gpu.currentTemp - 50) * 2)
      ));

      // Update core and memory clocks with some variation
      gpu.core = Math.floor(1200 + Math.random() * 300);
      gpu.memory = Math.floor(9500 + Math.random() * 1000);

      return {
        model: gpu.model,
        temperature: Math.round(gpu.currentTemp),
        fanSpeed: gpu.fanSpeed,
        hashrate: Math.floor(gpu.baseHashrate * hashrateFactor),
        power: Math.floor(gpu.basePower * powerFactor),
        memory: gpu.memory,
        core: gpu.core,
      };
    });

    // Calculate totals
    const totalHashrate = gpuMetrics.reduce((sum, gpu) => sum + gpu.hashrate, 0);
    const totalPower = gpuMetrics.reduce((sum, gpu) => sum + gpu.power, 0);

    return {
      gpus: gpuMetrics,
      totalHashrate,
      totalPower,
    };
  }

  handleServerMessage(message) {
    console.log('Received message:', message);

    switch (message.type) {
      case 'registered':
        console.log('Registration successful');
        this.startMining();
        break;

      case 'optimize':
        console.log('Applying optimization:', message.recommendations);
        // Simulate applying optimizations
        Object.entries(message.recommendations).forEach(([gpuId, recommendation]) => {
          const index = parseInt(gpuId.replace('gpu', ''));
          if (this.gpus[index]) {
            if (recommendation.type === 'temperature') {
              this.gpus[index].baseTemp *= (1 + recommendation.value / 100);
            } else if (recommendation.type === 'efficiency') {
              this.gpus[index].baseHashrate *= 1.05; // 5% improvement
              this.gpus[index].basePower *= 0.95; // 5% reduction
            }
          }
        });
        break;

      case 'error':
        console.error('Server error:', message.message);
        break;
    }
  }

  send(data) {
    if (this.isConnected) {
      this.ws.send(JSON.stringify(data));
    }
  }

  reconnect() {
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.connect();
    }, 5000);
  }
}

// Create and start test rig
const testRig = new TestRig();
testRig.connect();

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down test rig...');
  if (testRig.metricsInterval) {
    clearInterval(testRig.metricsInterval);
  }
  if (testRig.ws) {
    testRig.ws.close();
  }
  process.exit(0);
});