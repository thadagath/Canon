const express = require('express');
const axios = require('axios');
const cors = require('cors');
const WebSocket = require('ws');
const si = require('systeminformation');
const http = require('http');
const connectDB = require('./config/db');
const rigRoutes = require('./routes/rigRoutes');
const authRoutes = require('./routes/authRoutes');
const morgan = require('morgan');
const winston = require('winston');
require('dotenv').config(); // Add this line to load environment variables

// Initialize Express
const app = express();
console.log('Starting server initialization...');

// Connect to MongoDB
connectDB();

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
const wss = new WebSocket.Server({ port: 8080 }); // WebSocket server on port 8080

wss.on('connection', (ws) => {
  console.log('Client connected');

  const marketdata_interval = setInterval(async () => {
    try{
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
      );
      ws.send(JSON.stringify(response.data));
    }catch(err){
      console.error('Error fetching market info:', err);
      ws.send('error');
    }
    
  }, 5000);

  const miningdata_interval = setInterval(async () => {
    try{
      const response = await axios.get(
        'https://whattomine.com/coins.json'
      );
      console.log('sucess fetching',response);
      ws.send(JSON.stringify(response.data));
      console.log('sucess fetching',JSON.stringify(response.data));
    }catch(err){
      console.error('Error fetching mining info:', err);
      ws.send('error');
    }
  
  }, 5000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(marketdata_interval);
    clearInterval(miningdata_interval);
  });
});

console.log('WebSocket server running on ws://localhost:8080');

// Start the proxy WebSocket server
require('./proxyWebSocketServer');

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