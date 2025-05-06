# Express Neo4j Integration

This project demonstrates how to integrate Neo4j with an Express.js application written in TypeScript.

## Prerequisites

- Node.js (v14 or higher)
- npm
- Neo4j Database (local or remote)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables in `.env` file:
   ```
   NEO4J_URI=bolt://localhost:7687
   NEO4J_USERNAME=neo4j
   NEO4J_PASSWORD=your_password
   ```

## Neo4j Setup

1. Download and install Neo4j Desktop from [https://neo4j.com/download/](https://neo4j.com/download/)
2. Create a new database or use an existing one
3. Start the database
4. Update the `.env` file with your Neo4j credentials

## Running the Application

Start the development server:

```
npm run dev
```

The server will be available at http://localhost:3000

## Testing Neo4j Connection

Run the test script to verify the Neo4j connection:

```
npx tsx src/scripts/test-neo4j.ts
```

## API Endpoints

### Neo4j

- `POST /api/neo4j/query` - Execute a Cypher query
  - Request body:
    ```json
    {
      "query": "MATCH (n) RETURN n LIMIT 10",
      "params": {}
    }
    ```

- `GET /api/neo4j/health` - Check Neo4j database health

## Example Cypher Queries

### Create a Node

```cypher
CREATE (p:Person {name: 'John Doe', age: 30})
RETURN p
```

### Query Nodes

```cypher
MATCH (p:Person)
WHERE p.age > 25
RETURN p
```

### Create a Relationship

```cypher
MATCH (a:Person {name: 'John Doe'}), (b:Person {name: 'Jane Doe'})
CREATE (a)-[r:KNOWS {since: date('2023-01-01')}]->(b)
RETURN a, r, b
```

### Query with Relationships

```cypher
MATCH (a:Person)-[r:KNOWS]->(b:Person)
RETURN a.name, type(r), b.name