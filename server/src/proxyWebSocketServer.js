const WebSocket = require('ws');
const http = require('http');

const proxyServer = http.createServer();
const wss = new WebSocket.Server({ server: proxyServer });

const rigConnections = new Map();

wss.on('connection', (ws, req) => {
  console.log('Proxy WebSocket server: Client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'register') {
        const { ip, port } = data.connectionDetails;
        const rigWs = new WebSocket(`ws://${ip}:${port}`);

        rigWs.on('open', () => {
          console.log(`Connected to rig WebSocket server at ws://${ip}:${port}`);
          rigWs.send(message);
        });

        rigWs.on('message', (rigMessage) => {
          ws.send(rigMessage);
        });

        rigWs.on('close', () => {
          console.log(`Disconnected from rig WebSocket server at ws://${ip}:${port}`);
          ws.close();
        });

        rigWs.on('error', (error) => {
          console.error(`WebSocket error with rig at ws://${ip}:${port}:`, error);
          ws.close();
        });

        rigConnections.set(ws, rigWs);
      } else {
        const rigWs = rigConnections.get(ws);
        if (rigWs && rigWs.readyState === WebSocket.OPEN) {
          rigWs.send(message);
        }
      }
    } catch (error) {
      console.error('Error handling message:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    const rigWs = rigConnections.get(ws);
    if (rigWs) {
      rigWs.close();
      rigConnections.delete(ws);
    }
    console.log('Proxy WebSocket server: Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('Proxy WebSocket server error:', error);
    const rigWs = rigConnections.get(ws);
    if (rigWs) {
      rigWs.close();
      rigConnections.delete(ws);
    }
  });
});

const PORT = process.env.PROXY_WS_PORT || 8081;
proxyServer.listen(PORT, () => {
  console.log(`Proxy WebSocket server running on ws://localhost:${PORT}`);
});