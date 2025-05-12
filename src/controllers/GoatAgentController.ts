import { Request, Response } from 'express';
import { GoatAgentService } from '../services/GoatAgentService';
import { ApiError } from '../middleware/errorHandler';

// Get the singleton instance of the GoatAgentService
const goatAgentService = GoatAgentService.getInstance();

/**
 * Controller for GoatAgent-related routes
 */
export const goatAgentController = {
  /**
   * Execute a tool
   */
  executeTool: async (req: Request, res: Response): Promise<void> => {
    try {
      const { toolName, parameters } = req.body;
      
      if (!toolName) {
        const error = new Error('Tool name is required') as ApiError;
        error.statusCode = 400;
        throw error;
      }

      const result = await goatAgentService.executeTool(toolName, parameters);
      res.send({ result });
    } catch (error) {
      const apiError = error as ApiError;
      apiError.statusCode = apiError.statusCode || 500;
      throw apiError;
    }
  },

  /**
   * Get tools metadata
   */
  getToolsMetadata: async (req: Request, res: Response): Promise<void> => {
    try {
      const metadata = goatAgentService.getToolsMetadata();
      res.json(metadata);
    } catch (error) {
      const apiError = error as ApiError;
      apiError.statusCode = 500;
      throw apiError;
    }
  },

  /**
   * Get chain information
   */
  getChainInfo: async (req: Request, res: Response): Promise<void> => {
    try {
      const chainInfo = goatAgentService.getChainInfo();
      res.json(chainInfo);
    } catch (error) {
      const apiError = error as ApiError;
      apiError.statusCode = 500;
      throw apiError;
    }
  }
};