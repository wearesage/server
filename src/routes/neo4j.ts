import express, { Router } from 'express';
import Neo4jController from '../controllers/Neo4jController';

const router: Router = express.Router();
const neo4jController = new Neo4jController();

// POST /api/neo4j/query - Execute a Cypher query
router.post('/query', (req, res) => neo4jController.executeQuery(req, res));

// GET /api/neo4j/health - Check Neo4j database health
router.get('/health', (req, res) => neo4jController.healthCheck(req, res));

export default router;