// error.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[Global Error]', err.stack);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation Error',
      details: err.message 
    });
  }
  
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({ 
      message: 'Database Error',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
    });
  }

  // Default error response
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};
