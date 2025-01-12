# aiHash Mining Rig Connection Guide

This guide explains how to connect your mining rig to the aiHash optimization platform.

## Overview

The aiHash platform uses WebSocket connections for real-time communication with mining rigs, enabling:
- Real-time performance monitoring
- AI-driven optimization recommendations
- Automatic hardware adjustments
- Alert notifications
- Status reporting

## Connection Methods

### 1. Using the Sample Client

We provide a sample client implementation in `src/examples/rig-client.js` that demonstrates how to:
- Establish WebSocket connections
- Report mining metrics
- Receive and apply optimization recommendations
- Handle connection management
- Process server commands

To test the sample client:

```bash
# Install dependencies
npm install ws

# Run the client
node src/examples/rig-client.js
```

### 2. Direct Integration

For mining software developers, integrate with our WebSocket API:

1. Connect to WebSocket server: `ws://your-server:5000`

2. Send registration message:
```json
{
  "type": "register",
  "owner": "wallet_address",
  "name": "rig_name",
  "connectionDetails": {
    "ip": "rig_ip",
    "protocol": "stratum2"
  }
}
```

3. Send periodic metrics:
```json
{
  "type": "metrics",
  "metrics": {
    "gpus": [{
      "model": "GPU_MODEL",
      "temperature": 65,
      "fanSpeed": 70,
      "hashrate": 95000000,
      "power": 220,
      "memory": 10000,
      "core": 1500
    }],
    "totalHashrate": 95000000,
    "totalPower": 220
  }
}
```

4. Handle server messages:
- `registered`: Confirmation of successful registration
- `optimize`: Optimization recommendations
- `settings`: Platform settings updates
- `error`: Error messages

## API Documentation

### WebSocket Events

| Event Type | Direction | Description |
|------------|-----------|-------------|
| register   | Client → Server | Register a new mining rig |
| metrics    | Client → Server | Report mining metrics |
| status     | Client → Server | Update rig status |
| alert      | Client → Server | Report issues or alerts |
| optimize   | Server → Client | Optimization recommendations |
| settings   | Server → Client | Platform settings updates |

### REST API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/rigs/owner/:address | GET | Get all rigs for an owner |
| /api/rigs/:id | GET | Get specific rig details |
| /api/rigs/:id/settings | PATCH | Update rig settings |
| /api/rigs/:id/performance | GET | Get rig performance history |
| /api/rigs/:id/alerts | GET | Get rig alerts |
| /api/rigs/:id/stats | GET | Get rig statistics |

## Security Considerations

1. Use secure WebSocket connections (WSS) in production
2. Validate wallet ownership before registration
3. Implement rate limiting for API requests
4. Monitor for suspicious activity
5. Keep client software updated

## Best Practices

1. Implement automatic reconnection with backoff
2. Cache metrics during connection loss
3. Validate all received commands
4. Monitor resource usage
5. Log important events
6. Handle errors gracefully

## Troubleshooting

Common issues and solutions:

1. Connection Failed
   - Check network connectivity
   - Verify server address
   - Check firewall settings

2. Registration Failed
   - Verify wallet address
   - Check rig name uniqueness
   - Ensure valid connection details

3. Metrics Not Updating
   - Check metrics collection interval
   - Verify GPU monitoring functionality
   - Check WebSocket connection status

## Support

For technical support:
- Create an issue on GitHub
- Join our Discord community
- Contact support@aihash.com

## Updates

Stay updated with the latest client software and protocol changes by:
- Following our GitHub repository
- Subscribing to our newsletter
- Joining our Discord server