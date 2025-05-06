import { Router, Request, Response } from 'express';
import ollamaRoutes from './ollama';
import neo4jRoutes from './neo4j';

import akashRoutes from './akash';

const router = Router();

// GET /api
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API is working' });
});

// GET /api/status
router.get('/status', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount Ollama routes
router.use('/ollama', ollamaRoutes);

// Mount Neo4j routes
router.use('/neo4j', neo4jRoutes);

// Mount Akash routes
router.use('/api/akash', akashRoutes);

export default router;