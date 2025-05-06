import express, { Router } from 'express';
import { OllamaController } from '../controllers/OllamaController';

const router: Router = express.Router();
const ollamaController = new OllamaController();

// GET /api/ollama/models - Get all available models
router.get('/models', (req, res) => ollamaController.getModels(req, res));

// POST /api/ollama/generate - Generate a completion
router.post('/generate', (req, res) => ollamaController.generateCompletion(req, res));

// POST /api/ollama/embeddings - Generate embeddings
router.post('/embeddings', (req, res) => ollamaController.generateEmbedding(req, res));

// GET /api/ollama/health - Check Ollama server health
router.get('/health', (req, res) => ollamaController.healthCheck(req, res));

export default router;