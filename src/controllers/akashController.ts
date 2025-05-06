import { Request, Response } from 'express';
import { akashService } from '../services/akashService';
import { ApiError } from '../middleware/errorHandler';

/**
 * Controller for Akash-related routes
 */
export const akashController = {
  /**
   * Get a list of providers
   */
  getProviders: async (req: Request, res: Response): Promise<void> => {
    try {
      const providers = await akashService.getProviders();
      res.json(providers);
    } catch (error) {
      const apiError = error as ApiError;
      apiError.statusCode = 500;
      throw apiError;
    }
  },

  /**
   * Get a provider by address
   */
  getProvider: async (req: Request, res: Response): Promise<void> => {
    try {
      const { address } = req.params;
      
      if (!address) {
        const error = new Error('Provider address is required') as ApiError;
        error.statusCode = 400;
        throw error;
      }

      const provider = await akashService.getProvider(address);
      
      if (!provider) {
        const error = new Error(`Provider with address ${address} not found`) as ApiError;
        error.statusCode = 404;
        throw error;
      }
      
      res.json(provider);
    } catch (error) {
      const apiError = error as ApiError;
      apiError.statusCode = apiError.statusCode || 500;
      throw apiError;
    }
  },

  /**
   * Get network capacity
   */
  getNetworkCapacity: async (req: Request, res: Response): Promise<void> => {
    try {
      const capacity = await akashService.getNetworkCapacity();
      
      if (!capacity) {
        const error = new Error('Network capacity data not found') as ApiError;
        error.statusCode = 404;
        throw error;
      }
      
      res.json(capacity);
    } catch (error) {
      const apiError = error as ApiError;
      apiError.statusCode = apiError.statusCode || 500;
      throw apiError;
    }
  },

  /**
   * Get deployments for a provider
   */
  getProviderDeployments: async (req: Request, res: Response): Promise<void> => {
    try {
      const { provider } = req.params;
      const { skip = '0', limit = '20', status } = req.query;
      
      if (!provider) {
        const error = new Error('Provider address is required') as ApiError;
        error.statusCode = 400;
        throw error;
      }

      const skipNum = parseInt(skip as string, 10);
      const limitNum = parseInt(limit as string, 10);
      
      if (isNaN(skipNum) || isNaN(limitNum)) {
        const error = new Error('Skip and limit must be valid numbers') as ApiError;
        error.statusCode = 400;
        throw error;
      }

      const statusParam = status as 'active' | 'closed' | undefined;
      
      const deployments = await akashService.getProviderDeployments(
        provider,
        skipNum,
        limitNum,
        statusParam
      );
      
      res.json(deployments);
    } catch (error) {
      const apiError = error as ApiError;
      apiError.statusCode = apiError.statusCode || 500;
      throw apiError;
    }
  },

  /**
   * Get deployments for an address
   */
  getAddressDeployments: async (req: Request, res: Response): Promise<void> => {
    try {
      const { address } = req.params;
      const { skip = '0', limit = '20', status, reverseSorting } = req.query;
      
      if (!address) {
        const error = new Error('Address is required') as ApiError;
        error.statusCode = 400;
        throw error;
      }

      const skipNum = parseInt(skip as string, 10);
      const limitNum = parseInt(limit as string, 10);
      
      if (isNaN(skipNum) || isNaN(limitNum)) {
        const error = new Error('Skip and limit must be valid numbers') as ApiError;
        error.statusCode = 400;
        throw error;
      }

      const reverseSortingBool = reverseSorting === 'true';
      
      const deployments = await akashService.getAddressDeployments(
        address,
        skipNum,
        limitNum,
        status as string,
        reverseSortingBool
      );
      
      if (!deployments) {
        const error = new Error(`Deployments for address ${address} not found`) as ApiError;
        error.statusCode = 404;
        throw error;
      }
      
      res.json(deployments);
    } catch (error) {
      const apiError = error as ApiError;
      apiError.statusCode = apiError.statusCode || 500;
      throw apiError;
    }
  },

  /**
   * Get templates
   */
  getTemplates: async (req: Request, res: Response): Promise<void> => {
    try {
      const templates = await akashService.getTemplates();
      res.json(templates);
    } catch (error) {
      const apiError = error as ApiError;
      apiError.statusCode = 500;
      throw apiError;
    }
  },

  /**
   * Get a template by ID
   */
  getTemplate: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        const error = new Error('Template ID is required') as ApiError;
        error.statusCode = 400;
        throw error;
      }

      const template = await akashService.getTemplate(id);
      
      if (!template) {
        const error = new Error(`Template with ID ${id} not found`) as ApiError;
        error.statusCode = 404;
        throw error;
      }
      
      res.json(template);
    } catch (error) {
      const apiError = error as ApiError;
      apiError.statusCode = apiError.statusCode || 500;
      throw apiError;
    }
  },

  /**
   * Get GPU prices
   */
  getGpuPrices: async (req: Request, res: Response): Promise<void> => {
    try {
      const prices = await akashService.getGpuPrices();
      
      if (!prices) {
        const error = new Error('GPU prices data not found') as ApiError;
        error.statusCode = 404;
        throw error;
      }
      
      res.json(prices);
    } catch (error) {
      const apiError = error as ApiError;
      apiError.statusCode = apiError.statusCode || 500;
      throw apiError;
    }
  },

  /**
   * Estimate deployment price
   */
  estimatePrice: async (req: Request, res: Response): Promise<void> => {
    try {
      const { cpu, memory, storage } = req.body;
      
      if (!cpu || !memory || !storage) {
        const error = new Error('CPU, memory, and storage are required') as ApiError;
        error.statusCode = 400;
        throw error;
      }

      const cpuNum = parseInt(cpu, 10);
      const memoryNum = parseInt(memory, 10);
      const storageNum = parseInt(storage, 10);
      
      if (isNaN(cpuNum) || isNaN(memoryNum) || isNaN(storageNum)) {
        const error = new Error('CPU, memory, and storage must be valid numbers') as ApiError;
        error.statusCode = 400;
        throw error;
      }

      const prices = await akashService.estimatePrice(cpuNum, memoryNum, storageNum);
      
      if (!prices) {
        const error = new Error('Price estimation failed') as ApiError;
        error.statusCode = 500;
        throw error;
      }
      
      res.json(prices);
    } catch (error) {
      const apiError = error as ApiError;
      apiError.statusCode = apiError.statusCode || 500;
      throw apiError;
    }
  }
};