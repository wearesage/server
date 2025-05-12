import { Request, Response } from 'express';
import { BraveService } from '../services/BraveService';

export class BraveController {
  private braveService: BraveService;

  constructor() {
    this.braveService = new BraveService();
  }

  /**
   * Proxy a search request to Brave Search API
   * @param req Express request
   * @param res Express response
   */
  async search(req: Request, res: Response): Promise<void> {
    try {
      const { query, count } = req.query;
      
      if (!query || typeof query !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Query parameter is required and must be a string'
        });
        return;
      }

      const searchCount = count ? parseInt(count as string, 10) : 10;
      
      const results = await this.braveService.search(query, searchCount);
      
      res.status(200).json({
        success: true,
        results
      });
    } catch (error: any) {
      console.error('Error in Brave search controller:', error);
      
      res.status(500).json({
        success: false,
        message: error.message || 'An error occurred while searching',
        error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      });
    }
  }
}