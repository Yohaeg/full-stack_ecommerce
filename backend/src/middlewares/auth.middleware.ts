import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction):void => {
  try{
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]; // Bearer token

      if (!token) {
        res.status(401).json({ message: 'Access token missing' });
        return; 
      }
      if (token){
      jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
          if (err) {
            res.status(403).json({ message: 'Invalid token' });
            return;
          }

          req.userId = decoded.id;
          
          return next();
        });
      }else{
        res.status(401).json({ message: 'Access token missing' });
        return;
      }
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
