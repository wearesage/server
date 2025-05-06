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
}

export default Neo4jController;