# SAGE Server

Backend server for the SAGE DeFi agent platform.

## On-Chain Session Storage

This server implements on-chain session storage using Soneium L2. When a user signs in with Ethereum (SIWE), their session data (wallet address and authorized tools) is stored on the Soneium blockchain. This provides:

1. **Decentralized Authentication**: Session data is stored on-chain, providing a trustless verification mechanism
2. **Security**: Only essential data is stored on-chain (address, session hash, expiration)
3. **Verifiability**: Session data can be verified on-chain when needed

### How It Works

1. User signs a SIWE message containing the tools they want to authorize
2. Server verifies the signature and extracts the authorized tools
3. Server creates a session and stores it on-chain using the Soneium L2 blockchain
4. Session data can be verified on-chain when needed
5. Additional API endpoints are provided for verifying and revoking sessions

### Implementation Details

- `SessionManager.sol`: Solidity smart contract for storing session data
- `SoneiumService.ts`: Service for interacting with the Soneium blockchain
- `auth.ts`: Express route for handling authentication and session management

### Environment Variables

The following environment variables are required:

```
# Wallet Configuration
PRIVATE_KEY=your_private_key

# Soneium Configuration
SONEIUM_TEST_HTTPS=https://soneium-minato.rpc.scs.startale.com?apikey=your_api_key
SONEIUM_CHAIN_ID=1946
SONEIUM_CHAIN_NAME=Soneium Minato
SONEIUM_NETWORK=soneium-minato

# Reown SIWE
REOWN_PROJECT_ID=your_reown_project_id

# Session Contract (will be set after deployment)
SESSION_CONTRACT_ADDRESS=your_deployed_contract_address
```

### Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables (copy `.env.example` to `.env` and fill in the values)

3. Start the server:
   ```
   npm run dev
   ```

The server will automatically deploy the SessionManager contract if `SESSION_CONTRACT_ADDRESS` is not set in the environment variables.