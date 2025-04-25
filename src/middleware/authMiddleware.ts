import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Token is missing' });
        return;
    }
    try {
        const response = await axios.post('http://localhost:1625/v2/api/auth/verify/verify-token', { token });
        if (response.data.success) {
            next();
        } else {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).json({ message: 'Token verification failed' });
        return;
    }
};
