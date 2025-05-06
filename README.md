# SAGE Server

SAGE Server is a TypeScript-based Express API that integrates with Ollama (AI models), Neo4j (graph database), and the Akash Network (decentralized cloud computing). It serves as a backend service for managing AI model inference, graph database operations, and cloud deployments.

## Features

- **Ollama Integration**: Interface with Ollama API for AI model operations
  - List available models
  - Generate text completions
  - Generate embeddings
  - Health check for Ollama server

- **Neo4j Integration**: Interact with Neo4j graph database
  - Run Cypher queries
  - Process Neo4j results into usable formats
  - Database health checks

- **Akash Network Integration**: Manage decentralized cloud resources
  - Get providers and network capacity
  - Manage deployments
  - Access templates
  - Get GPU prices and estimate deployment costs

## Technologies

- **Node.js & Express**: Server framework
- **TypeScript**: Type-safe JavaScript
- **Neo4j Driver**: Graph database connectivity
- **Axios**: HTTP client for API requests
- **Dotenv**: Environment variable management

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd SAGE/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (create a `.env` file in the project root):
   ```
   PORT=3000
   
   # Neo4j Configuration
   NEO4J_URI=bolt://localhost:7687
   NEO4J_USERNAME=neo4j
   NEO4J_PASSWORD=your-password
   NEO4J_DATABASE=neo4j
   
   # Ollama Configuration (optional)
   OLLAMA_API_BASE_URL=http://localhost:11434
   
   # Akash Configuration (optional)
   AKASH_API_BASE_URL=https://console-api.akash.network/v1
   ```

## Usage

### Development

Run the server in development mode with hot reloading:

```bash
npm run dev
```

### Production

Build and run the server for production:

```bash
npm run build
npm start
```

## API Endpoints

### Base Endpoints

- `GET /`: Server status check
- `GET /health`: Health check endpoint
- `GET /api`: API status check
- `GET /api/status`: Detailed API status with version

### Ollama Endpoints

- `GET /api/ollama/models`: List available models
- `POST /api/ollama/generate`: Generate text completion
- `POST /api/ollama/embeddings`: Generate embeddings
- `GET /api/ollama/health`: Check Ollama server health

### Neo4j Endpoints

- `POST /api/neo4j/query`: Run a Cypher query
- `GET /api/neo4j/health`: Check Neo4j database health

### Akash Endpoints

- `GET /api/akash/providers`: Get list of providers
- `GET /api/akash/providers/:address`: Get provider details
- `GET /api/akash/network-capacity`: Get network capacity
- `GET /api/akash/templates`: Get deployment templates
- `GET /api/akash/gpu-prices`: Get GPU prices
- `POST /api/akash/pricing`: Estimate deployment price

## Development

### Project Structure

```
src/
├── controllers/       # Request handlers
│   ├── akashController.ts
│   ├── Neo4jController.ts
│   └── OllamaController.ts
├── interfaces/        # TypeScript interfaces
│   └── akash.interfaces.ts
├── middleware/        # Express middleware
│   ├── errorHandler.ts
│   └── logger.ts
├── routes/            # API routes
│   ├── akash.ts
│   ├── index.ts
│   ├── neo4j.ts
│   └── ollama.ts
├── services/          # Business logic
│   ├── akashService.ts
│   ├── Neo4jService.ts
│   └── OllamaService.ts
└── index.ts           # Application entry point
```

### Scripts

- `npm run dev`: Run in development mode with hot reloading
- `npm run build`: Build TypeScript to JavaScript
- `npm start`: Run the built application
- `npm test`: Run tests (not implemented yet)