import express, { Router } from 'express';
import { BraveController } from '../controllers/BraveController';

const router: Router = express.Router();
const braveController = new BraveController();

// GET /api/brave/search - Proxy search requests to Brave Search API
router.get('/search', (req, res) => braveController.search(req, res));

// GET /api/brave/health - Check Brave API health
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Brave Search API proxy is running',
    timestamp: new Date().toISOString()
  });
});

export default router;