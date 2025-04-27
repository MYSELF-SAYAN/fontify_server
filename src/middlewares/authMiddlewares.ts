import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
const JWT_SECRET = process.env.JWT_SECRET as string;

// Extend the Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authorization header missing or invalid' });
      return 
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as { id: string; role: string };
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Optional: Admin-only middleware
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
  console.log("User Role: ", req.user?.role); // Debugging line to check user role
  if (req.user?.role !== 'admin') {
   res.status(403).json({ message: 'Access forbidden: Admins only' });
   return 
  }
  next();
};
