import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken';

// Extend Express Request to include our user data
export interface AuthRequest extends Request {
    user?: any;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): any => {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message: 'Unauthorized: You must be logged in'
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
        next();
    } catch (error) {
        return res.status(401).json({message: 'Unauthorized: Invalid or expired token'})
    }
}