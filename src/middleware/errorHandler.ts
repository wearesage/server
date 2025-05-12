import { Request, Response, NextFunction } from 'express';

/**
 * Interface for custom API errors
 */
export interface ApiError extends Error {
  statusCode?: number;
}

/**
 * Middleware for handling errors
 */
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || (err as any).status || 500;
  
  console.error(`[Error] ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }
  
  res.status(statusCode).send({
    error: {
      message: err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  });
};

/**
 * Middleware for handling 404 Not Found errors
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error: ApiError = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};