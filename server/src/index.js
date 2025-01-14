const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');
const connectDB = require('./config/db');
const rigRoutes = require('./routes/rigRoutes');
const authRoutes = require('./routes/authRoutes');
const morgan = require('morgan');
const winston = require('winston');

// Initialize Express
const app = express();
console.log('Starting server initialization...');

// Connect to MongoDB
//connectDB();

// Configure logging
app.use(morgan('combined')); // Log HTTP requests
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'server.log' }),
    new winston.transports.Console()
  ]
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/rigs', rigRoutes);
app.use('/api/auth', authRoutes);

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Send initial message
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to AIHash mining server'
  }));

  // Handle incoming messages
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      // Handle different message types
      switch (data.type) {
        case 'hardware_update':
          // Broadcast hardware updates to all connected clients
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'hardware_update',
                data: data.data
              }));
            }
          });
          break;

        case 'status_update':
          // Broadcast status updates to all connected clients
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'status_update',
                data: data.data
              }));
            }
          });
          break;

        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5000;
console.log('Attempting to start server on port', PORT, '...');

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('WebSocket server ready for rig connections');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});