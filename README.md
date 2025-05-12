# SAGE Server

A secure blockchain tool execution API with on-chain session management.

## Overview

SAGE Server is a TypeScript/Express application that provides a secure API for executing blockchain tools. It uses the GOAT SDK for blockchain interactions and implements on-chain session management using the Soneium blockchain.

The server enables users to:
- Authenticate using Sign-In with Ethereum (SIWE)
- Execute blockchain tools securely
- Manage tool authorizations on-chain

## Features

- **Secure Authentication**: Sign-In with Ethereum (SIWE) for wallet-based authentication
- **On-Chain Session Management**: Sessions stored and verified on the Soneium blockchain
- **Tool Authorization**: Granular permissions for tool execution
- **Blockchain Integration**: Support for multiple blockchain protocols via GOAT SDK

## Architecture

### Core Components

- **Express Server**: RESTful API endpoints
- **GoatAgentService**: Blockchain tool execution service
- **SoneiumService**: On-chain session management service
- **SessionManager Contract**: Smart contract for storing sessions

### Authentication Flow

1. User signs a SIWE message containing authorized tools
2. Server verifies the signature
3. Server extracts authorized tools from the message
4. Server creates a session and stores it on-chain
5. Server returns a session token to the client

### Tool Execution Flow

1. Client sends a request to execute a tool
2. Server verifies the client's session token
3. Server checks if the client is authorized to use the requested tool
4. Server executes the tool using the GoatAgentService
5. Server returns the result to the client

## API Endpoints

### Authentication
- `POST /api/auth/verify-siwe`: Verify SIWE message and create session

### Session Management
- `GET /api/session/status/:address`: Get session status
- `POST /api/session/verify`: Verify session against on-chain storage
- `POST /api/session/revoke`: Revoke session

### Tool Execution
- `POST /api/agent/execute-tool`: Execute a blockchain tool
- `GET /api/agent/tools-metadata`: Get metadata about available tools
- `GET /api/agent/chain-info`: Get information about the connected blockchain

## Setup

### Prerequisites

- Node.js (v16+)
- npm (v8+)
- Ethereum wallet with private key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-organization/sage-server.git
cd sage-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
PORT=3000
PRIVATE_KEY=your_private_key_without_0x_prefix
REOWN_PROJECT_ID=your_reown_project_id
CORS_ORIGIN=*
```

4. Start the development server:
```bash
npm run dev
```

### Production Deployment

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Smart Contract

The `SessionManager.sol` contract manages user sessions on-chain:

```solidity
struct Session {
    bytes32 dataHash;      // Hash of the session data (tools list)
    uint256 expiresAt;     // Expiration timestamp
    bool isActive;         // Whether the session is active
}
```

Key functions:
- `registerSession`: Register a new session for a user
- `verifySession`: Verify if a session is valid
- `revokeSession`: Revoke a user's session
- `getSession`: Get a user's session details

## Available Tools

The server provides access to various blockchain tools through the GOAT SDK:

- Brave Plugin: Tools for interacting with the Brave browser
- Additional plugins can be added in the `GoatAgentService`

## Security Considerations

- Private keys should be kept secure and never committed to version control
- Use environment variables for sensitive configuration
- Consider implementing rate limiting for production deployments
- Regularly update dependencies to patch security vulnerabilities

## Development

### Project Structure

```
server/
├── contracts/            # Smart contracts
│   └── SessionManager.sol # Session management contract
├── src/
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── util/             # Utility functions
│   └── index.ts          # Entry point
├── .env                  # Environment variables
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript config
```

### Adding New Tools

To add new tools:

1. Update the `GoatAgentService.initializePlugins` method
2. Add the new plugin to the `plugins` array
3. Ensure the tool metadata is properly exposed

### Testing

```bash
# Run tests
npm test
```

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.