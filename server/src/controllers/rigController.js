const WebSocket = require('ws');
const { db } = require('../config/db');

class RigController {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.rigs = new Map(); // Store active WebSocket connections
    this.setupWebSocket();
    this.startInactiveRigCheck();
    
    // Initialize collections in memory
    db.rigs = new Map();
    db.alerts = new Map();
  }

  setupWebSocket() {
    this.wss.on('connection', (ws) => {
      console.log('New rig connection established');
      
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message);
          await this.handleMessage(ws, data);
        } catch (error) {
          console.error('Error handling message:', error);
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        this.handleDisconnect(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.handleDisconnect(ws);
      });
    });
  }

  async handleMessage(ws, data) {
    switch (data.type) {
      case 'register':
        await this.handleRegistration(ws, data);
        break;
      case 'metrics':
        await this.handleMetricsUpdate(ws, data);
        break;
      case 'status':
        await this.handleStatusUpdate(ws, data);
        break;
      case 'alert':
        await this.handleAlert(ws, data);
        break;
      default:
        ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
    }
  }

  async handleRegistration(ws, data) {
    try {
      const { owner, name, connectionDetails } = data;
      const rigId = `${owner}-${name}`;
      
      let rig = db.rigs.get(rigId);
      
      if (!rig) {
        rig = {
          id: rigId,
          owner,
          name,
          connectionDetails,
          status: 'online',
          lastSeen: Date.now(),
          settings: {
            autoOptimize: true,
            powerLimit: 80,
            targetTemperature: 70,
          },
          hardware: {
            gpus: [],
            totalHashrate: 0,
            totalPower: 0,
          },
          alerts: [],
        };
      } else {
        rig.status = 'online';
        rig.lastSeen = Date.now();
        rig.connectionDetails = connectionDetails;
      }

      db.rigs.set(rigId, rig);
      this.rigs.set(ws, rigId);

      ws.send(JSON.stringify({
        type: 'registered',
        rigId: rig.id,
        settings: rig.settings,
      }));

      // Send initial optimization settings
      this.sendOptimizationSettings(ws, rig);
    } catch (error) {
      console.error('Registration error:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Registration failed' }));
    }
  }

  async handleMetricsUpdate(ws, data) {
    try {
      const rigId = this.rigs.get(ws);
      if (!rigId) {
        throw new Error('Rig not registered');
      }

      const rig = db.rigs.get(rigId);
      if (!rig) {
        throw new Error('Rig not found');
      }

      // Update metrics
      rig.hardware = {
        ...rig.hardware,
        ...data.metrics,
      };
      rig.lastSeen = Date.now();
      db.rigs.set(rigId, rig);

      // Check metrics and send optimization recommendations
      const recommendations = this.analyzeMetrics(data.metrics);
      if (recommendations) {
        ws.send(JSON.stringify({
          type: 'optimize',
          recommendations,
        }));
      }
    } catch (error) {
      console.error('Metrics update error:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Failed to update metrics' }));
    }
  }

  async handleStatusUpdate(ws, data) {
    try {
      const rigId = this.rigs.get(ws);
      if (!rigId) {
        throw new Error('Rig not registered');
      }

      const rig = db.rigs.get(rigId);
      if (!rig) {
        throw new Error('Rig not found');
      }

      rig.status = data.status;
      rig.lastSeen = Date.now();
      db.rigs.set(rigId, rig);

      // Broadcast status update to all connected clients
      this.broadcastRigUpdate(rigId, rig);
    } catch (error) {
      console.error('Status update error:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Failed to update status' }));
    }
  }

  async handleAlert(ws, data) {
    try {
      const rigId = this.rigs.get(ws);
      if (!rigId) {
        throw new Error('Rig not registered');
      }

      const rig = db.rigs.get(rigId);
      if (!rig) {
        throw new Error('Rig not found');
      }

      const alert = {
        type: data.alertType,
        message: data.message,
        timestamp: Date.now(),
        resolved: false,
      };

      rig.alerts.push(alert);
      db.rigs.set(rigId, rig);

      // Broadcast alert to all connected clients
      this.broadcastRigUpdate(rigId, rig);
    } catch (error) {
      console.error('Alert handling error:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Failed to process alert' }));
    }
  }

  handleDisconnect(ws) {
    const rigId = this.rigs.get(ws);
    if (rigId) {
      const rig = db.rigs.get(rigId);
      if (rig) {
        rig.status = 'offline';
        rig.lastSeen = Date.now();
        db.rigs.set(rigId, rig);
        // Broadcast disconnect to all connected clients
        this.broadcastRigUpdate(rigId, rig);
      }
      this.rigs.delete(ws);
    }
  }

  broadcastRigUpdate(rigId, rig) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'rig_update',
          rigId,
          rig,
        }));
      }
    });
  }

  analyzeMetrics(metrics) {
    const recommendations = {};
    
    // Analyze GPU temperatures
    if (metrics.gpus) {
      metrics.gpus.forEach((gpu, index) => {
        if (gpu.temperature > 80) {
          recommendations[`gpu${index}`] = {
            type: 'temperature',
            action: 'decrease_power',
            value: -10,
          };
        }
        
        // Analyze efficiency
        const efficiency = gpu.hashrate / gpu.power;
        if (efficiency < this.getEfficiencyThreshold(gpu.model)) {
          recommendations[`gpu${index}`] = {
            type: 'efficiency',
            action: 'optimize_settings',
            suggestions: {
              power: Math.min(gpu.power * 0.9, this.getMaxPower(gpu.model)),
              core: this.getOptimalCore(gpu.model),
              memory: this.getOptimalMemory(gpu.model),
            },
          };
        }
      });
    }

    return Object.keys(recommendations).length > 0 ? recommendations : null;
  }

  // Helper methods for optimization
  getEfficiencyThreshold(gpuModel) {
    // Implementation would depend on GPU model and current market conditions
    return 0.5; // Example threshold
  }

  getMaxPower(gpuModel) {
    // Implementation would depend on GPU specifications
    return 250; // Example max power in watts
  }

  getOptimalCore(gpuModel) {
    // Implementation would depend on GPU model and mining algorithm
    return 1200; // Example core clock
  }

  getOptimalMemory(gpuModel) {
    // Implementation would depend on GPU model and mining algorithm
    return 2100; // Example memory clock
  }

  sendOptimizationSettings(ws, rig) {
    const optimizationSettings = {
      type: 'settings',
      settings: {
        powerLimit: rig.settings.powerLimit,
        targetTemperature: rig.settings.targetTemperature,
        autoOptimize: rig.settings.autoOptimize,
      },
    };
    ws.send(JSON.stringify(optimizationSettings));
  }

  startInactiveRigCheck() {
    setInterval(() => {
      try {
        const cutoff = Date.now() - 5 * 60 * 1000; // 5 minutes ago
        for (const [rigId, rig] of db.rigs.entries()) {
          if (rig.lastSeen < cutoff && rig.status !== 'offline') {
            rig.status = 'offline';
            rig.lastSeen = Date.now();
            db.rigs.set(rigId, rig);
            this.broadcastRigUpdate(rigId, rig);
          }
        }
      } catch (error) {
        console.error('Inactive rig check error:', error);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  }
}

module.exports = RigController;