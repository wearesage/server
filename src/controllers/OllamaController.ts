import { Request, Response } from 'express';
import { OllamaService } from '../services/OllamaService';

export class OllamaController {
  private ollamaService: OllamaService;

  constructor() {
    this.ollamaService = new OllamaService();
  }

  /**
   * Get all available models
   */
  async getModels(req: Request, res: Response): Promise<void> {
    try {
      const models = await this.ollamaService.listModels();
      res.status(200).json(models);
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to fetch models',
        message: error.message,
      });
    }
  }

  /**
   * Generate a completion
   */
  async generateCompletion(req: Request, res: Response): Promise<void> {
    try {
      const completionRequest = req.body;
      const completion = await this.ollamaService.generateCompletion(completionRequest);
      res.status(200).json(completion);
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to generate completion',
        message: error.message,
      });
    }
  }

  /**
   * Generate embeddings
   */
  async generateEmbedding(req: Request, res: Response): Promise<void> {
    try {
      const embeddingRequest = req.body;
      const embedding = await this.ollamaService.generateEmbedding(embeddingRequest);
      res.status(200).json(embedding);
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to generate embedding',
        message: error.message,
      });
    }
  }

  /**
   * Check Ollama server health
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      const isHealthy = await this.ollamaService.healthCheck();
      if (isHealthy) {
        res.status(200).json({ status: 'ok', message: 'Ollama server is running' });
      } else {
        res.status(503).json({ status: 'error', message: 'Ollama server is not running' });
      }
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to check Ollama server health',
        message: error.message,
      });
    }
  }
}

export default OllamaController;