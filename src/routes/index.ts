import { Router, Request, Response } from 'express';
import agentRoutes from './agent';
import authRoutes from './auth';
import sessionRoutes from './session';

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

// Mount GoatAgent routes
router.use('/agent', agentRoutes);

// Mount authorization routes
router.use('/auth', authRoutes);

// Mount session routes
router.use('/session', sessionRoutes);

export default router;