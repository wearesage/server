import { Request, Response } from 'express';
import { Neo4jService } from '../services/Neo4jService';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export class Neo4jController {
  private neo4jService: Neo4jService;

  constructor() {
    this.neo4jService = new Neo4jService(
      process.env.NEO4J_URI,
      process.env.NEO4J_USERNAME,
      process.env.NEO4J_PASSWORD,
      process.env.NEO4J_DATABASE
    );
  }

  /**
   * Execute a Cypher query
   */
  async executeQuery(req: Request, res: Response): Promise<void> {
    try {
      console.log('Neo4j Controller - executeQuery called');
      console.log('Request body:', JSON.stringify(req.body));
      
      const { query, params } = req.body;
      
      if (!query || typeof query !== 'string') {
        console.log('Invalid request: Query is required and must be a string');
        res.status(400).json({
          error: 'Invalid request',
          message: 'Query is required and must be a string',
        });
        return;
      }

      console.log('Executing Cypher query:', query);
      console.log('With params:', JSON.stringify(params || {}));
      
      try {
        const result = await this.neo4jService.runQuery(query, params || {});
        console.log('Query executed successfully');
        console.log('Result:', JSON.stringify(result).substring(0, 200) + '...');
        res.status(200).json(result);
      } catch (queryError: any) {
        console.error('Error executing query:', queryError);
        console.error('Error code:', queryError.code);
        console.error('Error message:', queryError.message);
        throw queryError;
      }
    } catch (error: any) {
      console.error('Neo4j Controller - executeQuery error:', error);
      res.status(500).json({
        error: 'Failed to execute Cypher query',
        message: error.message,
      });
    }
  }

  /**
   * Check Neo4j database health
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      console.log('Neo4j Controller - healthCheck called');
      
      try {
        const isHealthy = await this.neo4jService.healthCheck();
        console.log('Health check result:', isHealthy);
        
        if (isHealthy) {
          res.status(200).json({ status: 'ok', message: 'Neo4j database is running' });
        } else {
          res.status(503).json({ status: 'error', message: 'Neo4j database is not running' });
        }
      } catch (healthError: any) {
        console.error('Error during health check:', healthError);
        console.error('Error code:', healthError.code);
        console.error('Error message:', healthError.message);
        throw healthError;
      }
    } catch (error: any) {
      console.error('Neo4j Controller - healthCheck error:', error);
      res.status(500).json({
        error: 'Failed to check Neo4j database health',
        message: error.message,
      });
    }
  }
/**
   * Get graph data for visualization
   */
  async getGraphData(req: Request, res: Response): Promise<void> {
    try {
      // Cypher query to get nodes and relationships for visualization
      const query = `
        MATCH (n)-[r]->(m)
        RETURN n, r, m
        LIMIT 1000
      `;
      const result = await this.neo4jService.runQuery(query);

      // D3 expects { nodes: [...], links: [...] }
      const nodesMap: Record<string, any> = {};
      const links: any[] = [];

      // Helper to convert Neo4j integers to JS numbers (pure, non-mutating)
      function convertIntegers(obj: any): any {
        if (Array.isArray(obj)) {
          return obj.map(convertIntegers);
        } else if (obj && typeof obj === 'object') {
          if (obj.low !== undefined && obj.high !== undefined && Object.keys(obj).length === 2) {
            // Neo4j Integer
            return obj.low;
          }
          const newObj: any = {};
          for (const key of Object.keys(obj)) {
            newObj[key] = convertIntegers(obj[key]);
          }
          return newObj;
        }
        return obj;
      }

      for (const record of result.records) {
        // n, m are nodes; r is relationship
        const n = record.n;
        const m = record.m;
        const r = record.r;

        // Use Neo4j internal node IDs for D3 node IDs
        const nInternalId = r && r.startNodeId ? r.startNodeId : (n && n.id);
        const mInternalId = r && r.endNodeId ? r.endNodeId : (m && m.id);

        // Add nodes by internal id (avoid duplicates)
        if (n && nInternalId && !nodesMap[nInternalId]) {
          nodesMap[nInternalId] = {
            id: nInternalId,
            dataId: n.id, // original property id
            labels: n.labels,
            ...convertIntegers({ properties: n.properties })
          };
        }
        if (m && mInternalId && !nodesMap[mInternalId]) {
          nodesMap[mInternalId] = {
            id: mInternalId,
            dataId: m.id, // original property id
            labels: m.labels,
            ...convertIntegers({ properties: m.properties })
          };
        }

        // Add relationship as a link
        if (r) {
          links.push({
            id: r.id,
            type: r.type,
            source: nInternalId,
            target: mInternalId,
            ...convertIntegers({ properties: r.properties })
          });
        }
      }

      const nodes = Object.values(nodesMap);

      res.status(200).json({ nodes, edges: links });
    } catch (error: any) {
      console.error('Neo4j Controller - getGraphData error:', error);
      res.status(500).json({
        error: 'Failed to get graph data',
        message: error.message,
      });
    }
  }
}

export default Neo4jController;