import { type Response, type NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err: Error | AppError, _req: any, res: Response, _next: NextFunction) => {
  console.error('Error:', err.message);
  
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  
  return res.status(500).json({ error: 'Internal server error' });
};
