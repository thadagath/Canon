const WebSocket = require('ws');
const axios = require('axios');

// Configuration
const config = {
  rigId: null,
  owner: '0xa2d2de9f820fce6e5d142723c00d905188c34605fb473260033cf21d356a0486',
  name: 'Test Rig 1',
  wsUrl: 'ws://localhost:5000',
  apiUrl: 'http://localhost:5000/api'
};

// Simulated GPU data
const gpuModels = ['RTX 4090', 'RTX 4080', 'RTX 3090', 'RTX 3080'];

function generateRandomGPU() {
  const model = gpuModels[Math.floor(Math.random() * gpuModels.length)];
  const temperature = 50 + Math.random() * 30; // 50-80°C
  const fanSpeed = 30 + Math.random() * 70; // 30-100%
  const hashrate = 80 + Math.random() * 40; // 80-120 MH/s
  const power = 200 + Math.random() * 100; // 200-300W
  
  return {
    model,
    temperature: Math.round(temperature),
    fanSpeed: Math.round(fanSpeed),
    hashrate: Math.round(hashrate * 100) / 100,
    power: Math.round(power),
    memory: 1200 + Math.round(Math.random() * 400), // 1200-1600 MHz
    core: 1500 + Math.round(Math.random() * 500) // 1500-2000 MHz
  };
}

async function registerRig() {
  try {
    const response = await axios.post(`${config.apiUrl}/rigs/register`, {
      owner: config.owner,
      name: config.name,
      connectionDetails: {
        ip: '127.0.0.1',
        port: 3333,
        protocol: 'stratum2'
      }
    });
    
    config.rigId = response.data._id;
    console.log('Rig registered successfully:', config.rigId);
    return response.data;
  } catch (error) {
    console.error('Error registering rig:', error.message);
    throw error;
  }
}

function connectWebSocket() {
  const ws = new WebSocket(config.wsUrl);

  ws.on('open', () => {
    console.log('Connected to WebSocket server');
    startSendingUpdates(ws);
  });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log('Received message:', message);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Disconnected from server');
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      connectWebSocket();
    }, 5000);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  return ws;
}

function startSendingUpdates(ws) {
  // Generate initial GPU data
  const numGPUs = 2 + Math.floor(Math.random() * 3); // 2-4 GPUs
  let gpus = Array(numGPUs).fill(null).map(generateRandomGPU);

  // Send hardware updates every 5 seconds
  setInterval(async () => {
    if (!config.rigId) return;

    // Update GPU data with small variations
    gpus = gpus.map(gpu => ({
      ...gpu,
      temperature: Math.max(50, Math.min(80, gpu.temperature + (Math.random() * 2 - 1))),
      fanSpeed: Math.max(30, Math.min(100, gpu.fanSpeed + (Math.random() * 4 - 2))),
      hashrate: Math.max(80, Math.min(120, gpu.hashrate + (Math.random() * 2 - 1))),
      power: Math.max(200, Math.min(300, gpu.power + (Math.random() * 10 - 5)))
    }));

    const hardwareUpdate = {
      type: 'hardware_update',
      data: {
        rigId: config.rigId,
        gpus: gpus.map(gpu => ({
          ...gpu,
          temperature: Math.round(gpu.temperature),
          fanSpeed: Math.round(gpu.fanSpeed),
          hashrate: Math.round(gpu.hashrate * 100) / 100,
          power: Math.round(gpu.power)
        }))
      }
    };

    // Send update via WebSocket
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(hardwareUpdate));
    }

    // Update rig data via REST API
    try {
      await axios.patch(`${config.apiUrl}/rigs/${config.rigId}/hardware`, {
        gpus: hardwareUpdate.data.gpus
      });
    } catch (error) {
      console.error('Error updating rig data:', error.message);
    }
  }, 5000);
}

// Start the test rig
async function startTestRig() {
  try {
    await registerRig();
    connectWebSocket();
  } catch (error) {
    console.error('Error starting test rig:', error);
    process.exit(1);
  }
}

startTestRig();