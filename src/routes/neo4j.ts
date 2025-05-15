import express, { Router } from 'express';
import Neo4jController from '../controllers/Neo4jController';

const router: Router = express.Router();
const neo4jController = new Neo4jController();

router.post('/query', (req, res) => neo4jController.executeQuery(req, res));
router.get('/health', (req, res) => neo4jController.healthCheck(req, res));
router.get('/graph', (req, res) => neo4jController.getGraphData(req, res));
router.get('/schema', (req, res) => neo4jController.getSchema(req, res));
router.get('/nuke', (req, res) => neo4jController.nukeDatabase(req, res));

export default router;