import { Request, Response, NextFunction } from 'express';
import { SoneiumService } from '../services/SoneiumService';
import { createHash } from 'crypto';

// Get the singleton instance of the SoneiumService
const soneiumService = SoneiumService.getInstance();

/**
 * Interface for custom API errors
 */
interface VerificationError extends Error {
  statusCode: number;
}

/**
 * Middleware to verify if a user is authorized to use a specific tool
 * This middleware checks the on-chain session data to verify if the user
 * has authorized the tool they are trying to execute.
 */
export const verifyToolAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { toolName, parameters } = req.body;
    
    // Get the user's address from the session
    const sessionData = req.headers.authorization?.startsWith('Bearer ') 
      ? JSON.parse(Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString())
      : null;
    
    // If no session data, skip verification (for development/testing)
    if (!sessionData || !sessionData.address) {
      console.warn('No session data provided, skipping tool verification');
      return next();
    }
    
    const address = sessionData.address;
    
    // Check if Soneium service is initialized
    if (!soneiumService.isInitialized) {
      console.warn('Soneium service not initialized, skipping on-chain verification');
      return next();
    }
    
    try {
      // Get the authorized tools from the session
      const authorizedTools = sessionData.tools || [];
      const authorizedToolNames = authorizedTools.map((tool: any) => tool.name);
      
      console.log(`Verifying if user ${address} is authorized to use tool: ${toolName}`);
      console.log('Authorized tools:', authorizedToolNames);
      
      // Check if the tool is in the authorized tools list
      const isAuthorizedLocally = authorizedToolNames.includes(toolName);
      
      if (!isAuthorizedLocally) {
        const error = new Error(`User not authorized to use tool: ${toolName}`) as VerificationError;
        error.statusCode = 403;
        throw error;
      }
      
      // Verify on-chain if the session is valid
      const isValidOnChain = await soneiumService.verifySession(
        address,
        authorizedToolNames
      );
      
      if (!isValidOnChain) {
        const error = new Error('Session verification failed on-chain') as VerificationError;
        error.statusCode = 403;
        throw error;
      }
      
      // If we get here, the user is authorized to use the tool
      console.log(`User ${address} is authorized to use tool: ${toolName}`);
      next();
    } catch (error) {
      console.error('Error verifying tool authorization:', error);
      
      // If it's already a VerificationError, pass it along
      if ((error as VerificationError).statusCode) {
        throw error;
      }
      
      // Otherwise, create a new error
      const verificationError = new Error(`Tool verification failed: ${(error as Error).message}`) as VerificationError;
      verificationError.statusCode = 500;
      throw verificationError;
    }
  } catch (error) {
    const verificationError = error as VerificationError;
    verificationError.statusCode = verificationError.statusCode || 500;
    next(verificationError);
  }
};